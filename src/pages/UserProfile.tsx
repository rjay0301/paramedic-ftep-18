
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Sidebar from '@/components/navigation/Sidebar';
import { PhaseItem } from '@/types';
import { getCompletedPhases, getPhases } from '@/services/formService';
import ProfileCard from '@/components/profile/ProfileCard';
import { useProfileData } from '@/hooks/useProfileData';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    profileData,
    isLoading,
    isSaving,
    handleInputChange,
    saveProfile
  } = useProfileData();
  
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Fetch phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const phasesData = await getPhases();
        setPhases(phasesData);
        
        // Fetch completed phases
        const completedPhasesData = await getCompletedPhases();
        setCompletedPhases(completedPhasesData);
      } catch (error) {
        console.error('Error fetching phases:', error);
      }
    };
    
    fetchPhases();
  }, []);

  // Force refresh profile data when component mounts
  useEffect(() => {
    if (user?.id && profileData && !profileData.full_name) {
      // This indicates we need to reload the data
      toast.info("Refreshing profile data...");
    }
  }, [user?.id, profileData]);
  
  const handlePhaseSelect = (phase: PhaseItem) => {
    navigate(`/phase/${phase.id}`);
    setIsSidebarOpen(false);
  };
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }
  
  // Format profile data for the ProfileCard component
  const formattedProfile = {
    name: profileData.full_name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    department: profileData.department || '',
    hub: profileData.hub || '',
    unit: profileData.unit || '',
    corporationId: profileData.corp_id || '',
    role: profileData.role === 'student' ? 'Student' : 'Coordinator',
    joinDate: profileData.join_date ? new Date(profileData.join_date).toLocaleDateString() : 'Not Set',
    ftpName: profileData.ftp_name || '',
    emergencyContact: profileData.emergency_contact || ''
  };

  console.log('UserProfile - formatted profile data:', formattedProfile);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        phases={phases} 
        onPhaseSelect={handlePhaseSelect}
        completedPhases={completedPhases}
      />
      
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          title="User Profile" 
          subtitle="View and update your profile information"
        />
      </div>
      
      <ProfileCard
        profile={formattedProfile}
        isSaving={isSaving}
        onMenuClick={() => setIsSidebarOpen(true)}
        onSave={saveProfile}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default UserProfile;
