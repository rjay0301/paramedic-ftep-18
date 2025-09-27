
import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/types/coordinator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStudentsData = (userId: string | undefined, userRole: string | undefined, refreshCounter = 0) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!userId || userRole !== 'coordinator') return;

    try {
      setIsLoading(true);
      console.log('Fetching student data...');
      
      // Fetch only active students with valid profile associations
      // Added filter to only get records with role 'student'
      const { data: studentData, error } = await supabase
        .from('students')
        .select(`
          id,
          profile_id,
          alpha_unit_text,
          hub_id,
          hub_name,
          ftp_name,
          ftp_contact,
          updated_at,
          status,
          full_name,
          email
        `)
        .eq('status', 'active')
        .eq('role', 'student');

      if (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load student data');
        setIsLoading(false);
        return;
      }

      // Fetch hubs for fallback
      const { data: hubsData } = await supabase
        .from('hubs')
        .select('id, name');
      
      const hubsMap = new Map(hubsData?.map(hub => [hub.id, hub.name]));

      // Fetch progress data with detailed logging
      console.log('Fetching student progress data...');
      const { data: progressData, error: progressError } = await supabase
        .from('student_overall_progress')
        .select('*');

      if (progressError) {
        console.error('Error fetching progress data:', progressError);
      } else {
        console.log(`Retrieved progress data for ${progressData?.length || 0} students`);
      }

      const progressMap = new Map(progressData?.map(progress => [progress.student_id, progress]));

      // Fetch form submissions for detailed records
      console.log('Fetching form submissions...');
      const { data: formSubmissions, error: submissionsError } = await supabase
        .from('form_submissions')
        .select('id, form_type, form_number, student_id, submitted_at, status')
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });
        
      if (submissionsError) {
        console.error('Error fetching form submissions:', submissionsError);
      } else {
        console.log(`Retrieved ${formSubmissions?.length || 0} form submissions`);
      }

      const studentFormsMap = new Map();
      if (formSubmissions) {
        formSubmissions.forEach(submission => {
          if (!studentFormsMap.has(submission.student_id)) {
            studentFormsMap.set(submission.student_id, []);
          }
          studentFormsMap.get(submission.student_id).push({
            id: submission.id,
            name: `${submission.form_type.replace(/_/g, ' ')} #${submission.form_number}`,
            completedDate: new Date(submission.submitted_at).toLocaleDateString(),
            type: submission.form_type
          });
        });
      }

      const mappedStudents: Student[] = [];
      
      // Map students data with enhanced logging
      if (studentData && studentData.length > 0) {
        console.log(`Processing ${studentData.length} student records...`);
        
        const validStudents = studentData.filter(student => 
          student.status === 'active' && student.profile_id
        );
        
        for (const student of validStudents) {
          // Get user metadata only if needed 
          const studentName = student.full_name || 'Unknown';
          const studentEmail = student.email || '';
          
          // Check if we have a valid student record with at least an ID
          if (!student.id) {
            console.warn('Skipping invalid student record without ID');
            continue;
          }
          
          const progress = progressMap.get(student.id);
          let phase = 'Not Started';
          let progressPercentage = 0;
          
          if (progress) {
            progressPercentage = progress.overall_percentage || 0;
            
            // More accurate phase determination based on progress
            if (progressPercentage >= 90) phase = 'Final Evaluation';
            else if (progressPercentage >= 75) phase = 'Independent Phase';
            else if (progressPercentage >= 50) phase = 'Instructional Phase';
            else if (progressPercentage >= 25) phase = 'Observational Phase';
            else if (progressPercentage > 0) phase = 'Rural Ambulance';
            
            console.log(`Student ${studentName} progress: ${progressPercentage}% (${phase})`);
          } else {
            console.log(`No progress data found for student ${studentName}`);
          }

          // Use hub_name directly if available, fallback to hub mapping
          const hubName = student.hub_name || hubsMap.get(student.hub_id) || '';
          
          const forms = studentFormsMap.get(student.id) || [];
          console.log(`Student ${studentName} has ${forms.length} submitted forms`);

          mappedStudents.push({
            id: student.id,
            profile_id: student.profile_id, // Added the profile_id property here
            name: studentName,
            email: studentEmail,
            phone: '',
            progress: progressPercentage,
            phase,
            hub: hubName,
            alphaUnit: student.alpha_unit_text || '',
            ftpName: student.ftp_name || '',
            ftpContact: student.ftp_contact || '',
            lastUpdated: new Date(student.updated_at).toLocaleDateString(),
            forms
          });
        }
      }
      
      console.log(`Loaded ${mappedStudents.length} valid student records`);
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error in fetchStudents:', error);
      toast.error('Error loading student data');
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  // Fetch students when refreshCounter changes
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshCounter]);

  return { 
    students, 
    setStudents, 
    isLoading,
    refreshStudents: fetchStudents 
  };
};
