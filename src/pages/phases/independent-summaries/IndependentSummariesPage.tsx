
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { saveFormDraft, getFormDraft, deleteFormDraft } from '@/services/formService';
import { ClinicalAssessment, IndependentCaseSummaryData } from '@/types/independentSummaries';
import { EvaluationScore } from '@/types';
import IndependentCaseSummaryForm from './IndependentCaseSummaryForm';

// Default state for a new case summary
const getDefaultCaseSummary = (summaryNumber: number): IndependentCaseSummaryData => ({
  summary_number: summaryNumber,
  cfs_number: '',
  date: null,
  chief_complaint: '',
  priority: 'P1',
  clinical_assessment: {
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
  best_performance: '',
  needs_improvement: '',
  improvement_plan: '',
  discussed_with_ftp: false,
  ftp_signature: '',
  student_signature: '',
  status: 'draft',
});

const IndependentSummariesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseSummaries, setCaseSummaries] = useState<IndependentCaseSummaryData[]>(() => 
    Array.from({ length: 10 }, (_, i) => getDefaultCaseSummary(i + 1))
  );

  // Load any saved drafts when the component mounts
  useEffect(() => {
    const loadDrafts = async () => {
      if (!user) return;
      
      try {
        const updatedSummaries = [...caseSummaries];
        let foundDrafts = false;
        
        // Check for drafts for each summary
        for (let i = 0; i < 10; i++) {
          const draft = await getFormDraft<IndependentCaseSummaryData>(
            'independent_case_summaries',
            `summary_${i + 1}`,
            user.id
          );
          
          if (draft) {
            updatedSummaries[i] = draft;
            foundDrafts = true;
          }
        }
        
        if (foundDrafts) {
          setCaseSummaries(updatedSummaries);
          toast.info('Loaded saved drafts');
        }
      } catch (error) {
        console.error('Error loading drafts:', error);
        toast.error('Failed to load saved drafts');
      }
    };
    
    loadDrafts();
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleChange = (
    summaryIndex: number,
    field: keyof IndependentCaseSummaryData,
    value: IndependentCaseSummaryData[keyof IndependentCaseSummaryData]
  ) => {
    setCaseSummaries(prev => {
      const updated = [...prev];
      updated[summaryIndex] = {
        ...updated[summaryIndex],
        [field]: value
      };
      return updated;
    });
  };

  const handleClinicalAssessmentChange = (
    summaryIndex: number,
    field: keyof ClinicalAssessment,
    value: EvaluationScore
  ) => {
    setCaseSummaries(prev => {
      const updated = [...prev];
      updated[summaryIndex] = {
        ...updated[summaryIndex],
        clinical_assessment: {
          ...updated[summaryIndex].clinical_assessment,
          [field]: value
        }
      };
      return updated;
    });
  };

  const handleSaveDraft = async (summaryIndex: number) => {
    if (!user) {
      toast.error('You must be logged in to save drafts');
      return;
    }
    
    try {
      const summary = caseSummaries[summaryIndex];
      await saveFormDraft(
        'independent_case_summaries',
        `summary_${summaryIndex + 1}`,
        user.id,
        summary
      );
      toast.success('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const handleSubmit = async (summaryIndex: number) => {
    if (!user) {
      toast.error('You must be logged in to submit');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const summary = caseSummaries[summaryIndex];
      
      // Basic validation
      if (!summary.cfs_number) {
        toast.error('CFS Number is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!summary.ftp_signature) {
        toast.error('FTP Signature is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!summary.student_signature) {
        toast.error('Student Signature is required');
        setIsSubmitting(false);
        return;
      }
      
      // Mark as submitted and save
      const submittedSummary = {
        ...summary,
        status: 'submitted' as const
      };
      
      // Here you would typically send this to your API
      console.log('Submitting case summary:', submittedSummary);
      
      // Update state
      setCaseSummaries(prev => {
        const updated = [...prev];
        updated[summaryIndex] = submittedSummary;
        return updated;
      });
      
      // Delete the draft since it's now submitted
      await deleteFormDraft(
        'independent_case_summaries',
        `summary_${summaryIndex + 1}`,
        user.id
      );
      
      toast.success('Case summary submitted successfully');
      
      // Navigate to the next tab or back to the dashboard
      const nextTab = (summaryIndex + 2).toString();
      if (parseInt(nextTab) <= 10) {
        setActiveTab(nextTab);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting case summary:', error);
      toast.error('Failed to submit case summary');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Independent Case Summaries</CardTitle>
          <CardDescription>
            Complete all 10 independent case summaries as required for your training program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-5 md:grid-cols-10 mb-4">
              {Array.from({ length: 10 }, (_, i) => (
                <TabsTrigger key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {caseSummaries.map((summary, index) => (
              <TabsContent key={index + 1} value={(index + 1).toString()}>
                <IndependentCaseSummaryForm 
                  summaryData={summary}
                  handleChange={(field, value) => handleChange(index, field, value)}
                  handleClinicalAssessmentChange={(field, value) => handleClinicalAssessmentChange(index, field, value)}
                  handleSubmit={() => handleSubmit(index)}
                  handleSaveDraft={() => handleSaveDraft(index)}
                  summaryNumber={index + 1}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndependentSummariesPage;
