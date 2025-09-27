
import React from 'react';
import { EvaluationScore } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ClinicalPerformanceTableProps {
  clinicalPerformance: Record<string, EvaluationScore>;
  onClinicalPerformanceChange: (field: string, value: EvaluationScore) => void;
  disabled?: boolean;
}

export const ClinicalPerformanceTable: React.FC<ClinicalPerformanceTableProps> = ({
  clinicalPerformance,
  onClinicalPerformanceChange,
  disabled = false
}) => {
  // Helper function to render a score button
  const renderScoreButton = (field: string, score: EvaluationScore, currentValue: EvaluationScore) => {
    const isSelected = score === currentValue;
    const scoreText = score === 'N.P.' ? 'N.P.' : score.toString();
    
    return (
      <Button
        key={`${field}-${score}`}
        type="button"
        variant={isSelected ? "default" : "outline"}
        size="sm"
        className={`min-w-[40px] h-8 px-2 ${isSelected ? 'bg-primary-500' : ''}`}
        onClick={() => onClinicalPerformanceChange(field, score)}
        disabled={disabled}
      >
        <span>{scoreText}</span>
      </Button>
    );
  };

  // Helper function to format field names for display
  const formatFieldName = (field: string): string => {
    // Convert camelCase to Title Case with spaces
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderPerformanceRow = (field: string, value: EvaluationScore) => {
    const possibleScores: EvaluationScore[] = [3, 2, 1, 'N.P.'];
    
    return (
      <div key={field} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center py-2 border-b border-gray-100">
        <div className="md:col-span-2">
          <Label className="text-sm">{formatFieldName(field)}</Label>
        </div>
        <div className="md:col-span-4 flex flex-wrap gap-2">
          {possibleScores.map((score) => renderScoreButton(field, score, value))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground mb-2">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
          <div className="md:col-span-2"></div>
          <div className="md:col-span-4 flex flex-wrap gap-2 justify-between">
            <span className="px-2">3: Always Meets Standards</span>
            <span className="px-2">2: Usually Meets Standards</span>
            <span className="px-2">1: Does Not Meet Standards</span>
            <span className="px-2">N.P.: Not Performed</span>
          </div>
        </div>
      </div>
      
      {Object.entries(clinicalPerformance).map(([field, value]) => 
        renderPerformanceRow(field, value)
      )}
    </div>
  );
};
