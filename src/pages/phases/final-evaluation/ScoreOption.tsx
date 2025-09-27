
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PracticeLevel, ClinicalSkillScore, OperationalSkillScore } from '@/types/finalEvaluation';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScoreOptionProps {
  id: string;
  value: ClinicalSkillScore | OperationalSkillScore;
  practiceLevel: PracticeLevel;
  onScoreChange: (value: ClinicalSkillScore | OperationalSkillScore) => void;
  onPracticeLevelChange: (value: PracticeLevel) => void;
  maxScore: 3 | 5;
  description?: string;
}

const ScoreOption: React.FC<ScoreOptionProps> = ({
  id,
  value,
  practiceLevel,
  onScoreChange,
  onPracticeLevelChange,
  maxScore,
  description,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="border-b pb-3 space-y-3">
      <div className="flex justify-between gap-1">
        {Array.from({ length: maxScore }, (_, i) => i + 1).map((score) => (
          <div key={`${id}-score-${score}`} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border 
                ${value === score ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}
              onClick={() => onScoreChange(score as any)}
            >
              {score}
            </div>
            {description && <p className="text-xs text-center mt-1 hidden md:block">{description}</p>}
          </div>
        ))}
      </div>
      
      <RadioGroup 
        value={practiceLevel} 
        onValueChange={(val) => onPracticeLevelChange(val as PracticeLevel)} 
        className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-4'} mt-2`}
      >
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="I" id={`${id}-practice-I`} />
          <Label htmlFor={`${id}-practice-I`} className="text-xs">Independent</Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="MS" id={`${id}-practice-MS`} />
          <Label htmlFor={`${id}-practice-MS`} className="text-xs">Minimal Supervision</Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="D" id={`${id}-practice-D`} />
          <Label htmlFor={`${id}-practice-D`} className="text-xs">Dependent</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ScoreOption;
