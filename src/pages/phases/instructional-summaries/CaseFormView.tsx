
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { InstructionalCaseSummaryData, EvaluationScore } from '@/types';
import CaseBasicInfoCard from './components/CaseBasicInfoCard';
import CaseClinicalPerformanceCard from './components/CaseClinicalPerformanceCard';
import CaseAdditionalInfoCard from './components/CaseAdditionalInfoCard';
import CaseSignaturesCard from './components/CaseSignaturesCard';

interface CaseFormViewProps {
  currentSummary: number;
  onSave: (data: InstructionalCaseSummaryData) => void;
  onCancel: () => void;
}

const CaseFormView: React.FC<CaseFormViewProps> = ({ currentSummary, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialClinicalPerformance = {
    patientAssessment: 'N.P.' as EvaluationScore,
    assessmentSkills: 'N.P.' as EvaluationScore,
    historyTaking: 'N.P.' as EvaluationScore,
    nccCtlUpdate: 'N.P.' as EvaluationScore,
    sceneControl: 'N.P.' as EvaluationScore,
    patientMovement: 'N.P.' as EvaluationScore,
    provisionalDiagnosis: 'N.P.' as EvaluationScore,
    recognizingSeverity: 'N.P.' as EvaluationScore,
    treatmentPlan: 'N.P.' as EvaluationScore,
    priorityToHospital: 'N.P.' as EvaluationScore,
    traumaManagement: 'N.P.' as EvaluationScore,
    cardiacManagement: 'N.P.' as EvaluationScore,
    medicalManagement: 'N.P.' as EvaluationScore,
    pediatricManagement: 'N.P.' as EvaluationScore,
    airwayManagement: 'N.P.' as EvaluationScore,
    medicationAdmin: 'N.P.' as EvaluationScore,
    equipment: 'N.P.' as EvaluationScore,
    handover: 'N.P.' as EvaluationScore,
    pcrDocumentation: 'N.P.' as EvaluationScore,
    patientCommunication: 'N.P.' as EvaluationScore,
  };

  const initializeForm = () => ({
    summary_number: currentSummary,
    cfs_number: '',
    date: null,
    chief_complaint: '',
    priority: 'P1' as const,
    clinical_performance: initialClinicalPerformance,
    performed_well: '',
    areas_to_improve: '',
    ftp_feedback: '',
    skills_performed: '',
    medications_administered: '',
    student_signature: '',
    ftp_signature: '',
    status: 'draft' as const
  });

  const [formData, setFormData] = useState<InstructionalCaseSummaryData>(initializeForm());

  useEffect(() => {
    // Reset the form when the currentSummary changes
    setFormData(initializeForm());
  }, [currentSummary]);

  const handleChange = useCallback(<K extends keyof InstructionalCaseSummaryData>(
    key: K,
    value: InstructionalCaseSummaryData[K]
  ) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  }, []);

  const handleClinicalPerformanceChange = useCallback((key: string, value: EvaluationScore) => {
    setFormData(prevData => ({
      ...prevData,
      clinical_performance: {
        ...prevData.clinical_performance,
        [key]: value,
      },
    }));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
      toast.success('Case summary saved successfully');
    } catch (error) {
      console.error('Error saving case summary:', error);
      toast.error('Failed to save case summary');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <CaseBasicInfoCard 
        formData={formData}
        handleChange={handleChange}
        currentSummary={currentSummary}
        isSubmitting={isSubmitting}
      />
      
      <CaseClinicalPerformanceCard 
        formData={formData}
        handleClinicalPerformanceChange={handleClinicalPerformanceChange}
        isSubmitting={isSubmitting}
      />
      
      <CaseAdditionalInfoCard 
        formData={formData}
        handleChange={handleChange}
        isSubmitting={isSubmitting}
      />
      
      <CaseSignaturesCard 
        formData={formData}
        handleChange={handleChange}
        isSubmitting={isSubmitting}
      />

      <CardFooter className="flex justify-between">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Save'}
        </Button>
      </CardFooter>
    </div>
  );
};

export default CaseFormView;
