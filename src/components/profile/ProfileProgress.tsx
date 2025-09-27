
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { BarChart4, CheckCircle, CircleX, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileProgressProps {
  progress: number;
  completedForms: number;
  totalForms: number;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ 
  progress: initialProgress, 
  completedForms: initialCompleted, 
  totalForms 
}) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(initialProgress);
  const [completedForms, setCompletedForms] = useState(initialCompleted);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Listen for updates to progress
  useEffect(() => {
    if (!user?.id) return;

    // Update from props
    setProgress(initialProgress);
    setCompletedForms(initialCompleted);

    // Setup the async function for subscription
    async function setupSubscription() {
      try {
        // Set up real-time subscription for progress updates
        const progressChannel = supabase
          .channel('profile-progress-channel')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'student_overall_progress',
              filter: `student_id=eq.${user.id}`
            },
            async (payload) => {
              console.log('Progress updated:', payload);
              await fetchLatestProgress();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(progressChannel);
        };
      } catch (subscriptionError) {
        console.error('Error setting up subscription:', subscriptionError);
        return () => {}; // Return empty cleanup function on error
      }
    }

    // Function to fetch latest progress
    const fetchLatestProgress = async () => {
      try {
        setIsUpdating(true);
        setError(null);
        console.log('Fetching latest progress data');
        
        const { data, error } = await supabase
          .from('student_overall_progress')
          .select('overall_percentage, completed_forms, total_forms')
          .eq('student_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching student progress:', error);
          // Don't show errors about missing tables/records to the user
          if (error.code === "PGRST116") {
            setProgress(0);
            setCompletedForms(0);
            return;
          }
          setError('Failed to load progress data');
          return;
        }

        if (data) {
          console.log('Received updated progress data:', data);
          setProgress(data.overall_percentage || 0);
          setCompletedForms(data.completed_forms || 0);
        }
      } catch (error) {
        console.error('Error fetching student progress:', error);
        setError('Failed to update progress');
      } finally {
        setIsUpdating(false);
      }
    };

    // Set up subscription and fetch initial data
    const subscriptionPromise = setupSubscription();
    fetchLatestProgress();

    // Handle form submission events as fallback for real-time issues
    const handleFormSubmission = (event: CustomEvent) => {
      const { studentId } = event.detail || {};
      
      if (studentId && studentId === user.id) {
        console.log('Form submission event received');
        setTimeout(() => {
          fetchLatestProgress();
        }, 1000);
      }
    };

    // Add event listener
    window.addEventListener('formSubmitted', handleFormSubmission as EventListener);
    
    // Clean up everything on unmount
    return () => {
      window.removeEventListener('formSubmitted', handleFormSubmission as EventListener);
      
      // Clean up subscription
      subscriptionPromise.then(cleanupFn => {
        if (typeof cleanupFn === 'function') {
          cleanupFn();
        }
      });
    };
  }, [user?.id, initialProgress, initialCompleted]);
  
  const getStatusColor = () => {
    switch (user?.status) {
      case 'active':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'inactive':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusIcon = () => {
    switch (user?.status) {
      case 'active':
        return <CheckCircle size={16} className="mr-2" />;
      case 'pending':
        return <BarChart4 size={16} className="mr-2" />;
      case 'inactive':
        return <CircleX size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Profile Progress</h2>
        <BarChart4 size={20} className={`text-primary-500 ${isUpdating ? 'animate-spin' : ''}`} />
      </div>
      
      <div className="flex items-center mb-3">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          Status: {user?.status || 'pending'}
        </span>
      </div>
      
      {error ? (
        <div className="bg-red-50 p-2 rounded-md flex items-center text-sm text-red-800 mb-3">
          <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
          {error}
        </div>
      ) : (
        <>
          <Progress value={progress} className="h-4 mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span className="font-medium">{progress}% complete</span>
            <span>{completedForms}/{totalForms} forms</span>
          </div>
        </>
      )}
    </Card>
  );
};

export default ProfileProgress;
