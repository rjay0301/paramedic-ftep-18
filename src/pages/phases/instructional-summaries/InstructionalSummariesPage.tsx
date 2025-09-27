import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { InstructionalCaseSummaryData } from '@/types';
import CaseFormView from './CaseFormView';
import CaseDetailView from './CaseDetailView';

const getDefaultCaseSummary = (summaryNumber: number): InstructionalCaseSummaryData => ({
  summary_number: summaryNumber,
  cfs_number: '',
  date: null,
  chief_complaint: '',
  priority: 'P1',
  clinical_performance: {
    patientAssessment: 'N.P.',
    assessmentSkills: 'N.P.',
    historyTaking: 'N.P.',
    nccCtlUpdate: 'N.P.',
    sceneControl: 'N.P.',
    patientMovement: 'N.P.',
    provisionalDiagnosis: 'N.P.',
    recognizingSeverity: 'N.P.',
    treatmentPlan: 'N.P.',
    priorityToHospital: 'N.P.',
    traumaManagement: 'N.P.',
    cardiacManagement: 'N.P.',
    medicalManagement: 'N.P.',
    pediatricManagement: 'N.P.',
    airwayManagement: 'N.P.',
    medicationAdmin: 'N.P.',
    equipment: 'N.P.',
    handover: 'N.P.',
    pcrDocumentation: 'N.P.',
    patientCommunication: 'N.P.',
  },
  skills_performed: '',
  medications_administered: '',
  performed_well: '', // Add these fields that are being used
  areas_to_improve: '',
  ftp_feedback: '',
  student_signature: '',
  ftp_signature: '',
  status: 'draft'
});

const InstructionalSummariesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('summary1');
  const [summaries, setSummaries] = useState<InstructionalCaseSummaryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentSummary, setCurrentSummary] = useState<InstructionalCaseSummaryData | null>(null);
  
  // Fetch summaries from the database
  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('instructional_case_summaries')
          .select('*')
          .eq('student_id', user.id)
          .order('summary_number', { ascending: true });
        
        if (error) throw error;
        
        // If we have fewer than 20 summaries, create placeholder data for missing ones
        const existingSummaries = data || [];
        const allSummaries: InstructionalCaseSummaryData[] = [];
        
        for (let i = 1; i <= 20; i++) {
          const existingSummary = existingSummaries.find(s => s.summary_number === i);
          
          if (existingSummary) {
            // Process and cast the database record to match our type
            const processedSummary: InstructionalCaseSummaryData = {
              id: existingSummary.id,
              summary_number: existingSummary.summary_number,
              cfs_number: existingSummary.cfs_number || '',
              date: existingSummary.date,
              chief_complaint: existingSummary.chief_complaint || '',
              priority: existingSummary.priority as 'P1' | 'P2',
              clinical_performance: existingSummary.clinical_performance as any,
              skills_performed: existingSummary.skills_performed || '',
              medications_administered: existingSummary.medications_administered || '',
              // Add default values for the custom fields that might not exist in the database
              performed_well: existingSummary.performed_well || '',
              areas_to_improve: existingSummary.areas_to_improve || '',
              ftp_feedback: existingSummary.ftp_feedback || '',
              ftp_signature: existingSummary.ftp_signature || '',
              student_signature: existingSummary.student_signature || '',
              status: existingSummary.status as 'draft' | 'submitted',
            };
            
            allSummaries.push(processedSummary);
          } else {
            // Create a new empty summary
            allSummaries.push(getDefaultCaseSummary(i));
          }
        }
        
        setSummaries(allSummaries);
        
        // Set the first summary as current if we don't have one yet
        if (!currentSummary) {
          setCurrentSummary(allSummaries[0]);
        }
      } catch (err: any) {
        console.error('Error fetching summaries:', err);
        setError(err.message || 'Failed to load summaries');
        toast.error('Failed to load summaries');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSummaries();
  }, [user?.id]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const summaryNumber = parseInt(tab.replace('summary', ''));
    const summary = summaries.find(s => s.summary_number === summaryNumber);
    
    if (summary) {
      setCurrentSummary(summary);
      setEditMode(summary.status !== 'submitted');
    }
  };
  
  const handleSaveSummary = async (summaryData: InstructionalCaseSummaryData) => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('instructional_case_summaries')
        .upsert([{
          ...summaryData,
          student_id: user.id,
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      
      // Update the summary in the local state
      setSummaries(prev => {
        const updated = [...prev];
        const index = updated.findIndex(s => s.summary_number === summaryData.summary_number);
        
        if (index !== -1) {
          updated[index] = {
            ...summaryData,
            id: data?.[0]?.id || updated[index].id
          };
        }
        
        return updated;
      });
      
      toast.success('Case summary saved successfully');
      
      // Update current summary
      setCurrentSummary(summaryData);
      
      return data?.[0]?.id;
    } catch (err: any) {
      console.error('Error saving summary:', err);
      toast.error('Failed to save summary');
      throw err;
    }
  };
  
  const handleSubmitSummary = async (summaryIndex: number) => {
    const summary = summaries.find(s => s.summary_number === summaryIndex);
    
    if (!summary || !user?.id) return;
    
    // Mark as submitted and save
    const submittedSummary = {
      ...summary,
      status: 'submitted' as const
    };
    
    try {
      await handleSaveSummary(submittedSummary);
      
      // After submission, show the detail view
      setEditMode(false);
      
      toast.success('Case summary submitted successfully');
    } catch (err) {
      // Error handling is done in handleSaveSummary
    }
  };
  
  const handleEdit = () => {
    setEditMode(true);
  };
  
  const handleCancel = () => {
    // If it's a new (draft) summary without an ID, keep in edit mode
    if (currentSummary && !currentSummary.id) {
      // Just reset the form
      const summaryNumber = currentSummary.summary_number;
      setCurrentSummary(getDefaultCaseSummary(summaryNumber));
    } else {
      // Exit edit mode for existing summaries
      setEditMode(false);
    }
  };
  
  // Helper function to get the summary number from the active tab
  const getActiveSummaryNumber = (): number => {
    return parseInt(activeTab.replace('summary', ''));
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader 
          title="Instructional Case Summaries" 
          subtitle="Complete all 20 case summaries documenting your clinical experience" 
        />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="px-4 pb-6">
          <div className="overflow-x-auto pb-2 pt-2">
            <TabsList className="h-auto p-1 gap-1 flex flex-wrap justify-center">
              {Array.from({ length: 20 }, (_, i) => {
                const summary = summaries.find(s => s.summary_number === i + 1);
                const isCompleted = summary?.status === 'submitted';
                
                return (
                  <TabsTrigger 
                    key={i + 1} 
                    value={`summary${i + 1}`}
                    className={`
                      relative h-10 w-10 p-0 rounded-md font-medium text-sm 
                      flex items-center justify-center transition-all
                      ${isCompleted ? 'bg-primary-100 text-primary-800 hover:bg-primary-200' : 'hover:bg-gray-100'}
                    `}
                  >
                    <span>{i + 1}</span>
                    {isCompleted && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          
          {summaries.map((summary) => (
            <TabsContent 
              key={summary.id || `new-${summary.summary_number}`} 
              value={`summary${summary.summary_number}`}
              className="mt-4"
            >
              {editMode ? (
                <CaseFormView 
                  currentSummary={summary.summary_number}
                  onSave={handleSaveSummary}
                  onCancel={handleCancel}
                />
              ) : (
                <CaseDetailView 
                  summary={summary} 
                  onEdit={handleEdit}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default InstructionalSummariesPage;
