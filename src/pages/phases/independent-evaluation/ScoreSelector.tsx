
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EvaluationScore } from '@/types';
import { cn } from '@/lib/utils';

interface ScoreSelectorProps {
  label: string;
  value: EvaluationScore;
  onChange: (value: string) => void;
  className?: string;
}

const ScoreSelector: React.FC<ScoreSelectorProps> = ({
  label,
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-6 gap-2 items-center py-2 border-b border-gray-100", className)}>
      <div className="md:col-span-2">
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="md:col-span-4 flex flex-wrap gap-2">
        <ScoreButton score="3" currentValue={value} onClick={() => onChange('3')} />
        <ScoreButton score="2" currentValue={value} onClick={() => onChange('2')} />
        <ScoreButton score="1" currentValue={value} onClick={() => onChange('1')} />
        <ScoreButton score="N.P." currentValue={value} onClick={() => onChange('N.P.')} />
      </div>
    </div>
  );
};

interface ScoreButtonProps {
  score: string;
  currentValue: EvaluationScore;
  onClick: () => void;
}

const ScoreButton: React.FC<ScoreButtonProps> = ({ score, currentValue, onClick }) => {
  // Convert both to strings for proper comparison
  const isSelected = score === currentValue.toString();
  
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={cn(
        "min-w-[40px] h-8 px-2",
        isSelected && "bg-[#1EAEDB] text-white"
      )}
      onClick={onClick}
    >
      <span>{score}</span>
    </Button>
  );
};

export default ScoreSelector;
