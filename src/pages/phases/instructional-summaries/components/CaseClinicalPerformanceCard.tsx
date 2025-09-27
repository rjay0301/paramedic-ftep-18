
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ClinicalPerformanceTable } from './ClinicalPerformanceTable';
import { InstructionalCaseSummaryData, EvaluationScore } from '@/types';

interface CaseClinicalPerformanceCardProps {
  formData: InstructionalCaseSummaryData;
  handleClinicalPerformanceChange: (field: string, value: EvaluationScore) => void;
  isSubmitting: boolean;
}

const CaseClinicalPerformanceCard: React.FC<CaseClinicalPerformanceCardProps> = ({
  formData,
  handleClinicalPerformanceChange,
  isSubmitting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Performance Assessment</CardTitle>
        <CardDescription>Rate the clinical performance in various categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ClinicalPerformanceTable
          clinicalPerformance={formData.clinical_performance}
          onClinicalPerformanceChange={handleClinicalPerformanceChange}
          disabled={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default CaseClinicalPerformanceCard;
