
import React from 'react';
import { EvaluationScore } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ScoreItemProps {
  label: string;
  field: string;
  value: EvaluationScore;
  onChange: (field: string, value: EvaluationScore) => void;
}

export const ScoreItem: React.FC<ScoreItemProps> = ({ label, field, value, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center py-2 border-b border-gray-100">
      <div className="md:col-span-2">
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="md:col-span-4 flex flex-wrap gap-2">
        <ScoreButton score={3} currentValue={value} onClick={() => onChange(field, 3)} />
        <ScoreButton score={2} currentValue={value} onClick={() => onChange(field, 2)} />
        <ScoreButton score={1} currentValue={value} onClick={() => onChange(field, 1)} />
        <ScoreButton score="N.P." currentValue={value} onClick={() => onChange(field, 'N.P.')} />
      </div>
    </div>
  );
};

interface ScoreButtonProps {
  score: EvaluationScore;
  currentValue: EvaluationScore;
  onClick: () => void;
}

const ScoreButton: React.FC<ScoreButtonProps> = ({ score, currentValue, onClick }) => {
  const isSelected = score === currentValue;
  const scoreText = score === 'N.P.' ? 'N.P.' : score.toString();
  
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={`min-w-[40px] h-8 px-2 ${isSelected ? 'bg-primary-500' : ''}`}
      onClick={onClick}
    >
      <span>{scoreText}</span>
    </Button>
  );
};
