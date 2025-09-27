
import React from 'react';
import { ClinicalAssessment, IndependentCaseSummaryData } from '@/types/independentSummaries';
import { EvaluationScore } from '@/types';
import BasicInfoCard from './components/BasicInfoCard';
import ClinicalAssessmentCard from './components/ClinicalAssessmentCard';
import AdditionalInfoCard from './components/AdditionalInfoCard';
import FtpFeedbackCard from './components/FtpFeedbackCard';
import SignaturesCard from './components/SignaturesCard';

interface IndependentCaseSummaryFormProps {
  summaryData: IndependentCaseSummaryData;
  handleChange: <K extends keyof IndependentCaseSummaryData>(field: K, value: IndependentCaseSummaryData[K]) => void;
  handleClinicalAssessmentChange: (field: keyof ClinicalAssessment, value: EvaluationScore) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  summaryNumber: number;
  isSubmitting: boolean;
}

const IndependentCaseSummaryForm: React.FC<IndependentCaseSummaryFormProps> = ({
  summaryData,
  handleChange,
  handleClinicalAssessmentChange,
  handleSubmit,
  handleSaveDraft,
  summaryNumber,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <BasicInfoCard 
        summaryData={summaryData} 
        handleChange={handleChange} 
        summaryNumber={summaryNumber} 
      />
      
      <ClinicalAssessmentCard 
        clinicalAssessment={summaryData.clinical_assessment} 
        handleClinicalAssessmentChange={handleClinicalAssessmentChange} 
      />
      
      <AdditionalInfoCard 
        summaryData={summaryData} 
        handleChange={handleChange} 
        summaryNumber={summaryNumber} 
      />
      
      <FtpFeedbackCard 
        summaryData={summaryData} 
        handleChange={handleChange} 
        summaryNumber={summaryNumber} 
      />
      
      <SignaturesCard 
        summaryData={summaryData} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit} 
        handleSaveDraft={handleSaveDraft} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default IndependentCaseSummaryForm;
