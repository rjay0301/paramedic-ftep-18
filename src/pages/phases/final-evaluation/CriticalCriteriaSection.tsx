
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CriticalCriteria } from '@/types/finalEvaluation';

interface CriticalCriteriaSectionProps {
  criteria: CriticalCriteria;
  onChange: (field: keyof CriticalCriteria, value: boolean) => void;
}

const CriticalCriteriaSection: React.FC<CriticalCriteriaSectionProps> = ({
  criteria,
  onChange,
}) => {
  const handleCheckboxChange = (field: keyof CriticalCriteria) => {
    onChange(field, !criteria[field]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Critical Criteria</h3>
      <p className="text-sm text-gray-600">Check all that apply:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="unsafeAct" 
            checked={criteria.unsafeAct}
            onCheckedChange={() => handleCheckboxChange('unsafeAct')}
          />
          <Label htmlFor="unsafeAct" className="text-sm">
            Performed unsafe act that endangered self, patient, crew or bystanders
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="lossOfPatientControl" 
            checked={criteria.lossOfPatientControl}
            onCheckedChange={() => handleCheckboxChange('lossOfPatientControl')}
          />
          <Label htmlFor="lossOfPatientControl" className="text-sm">
            Lost control of the patient (actual or potential injury)
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="delegationFailure" 
            checked={criteria.delegationFailure}
            onCheckedChange={() => handleCheckboxChange('delegationFailure')}
          />
          <Label htmlFor="delegationFailure" className="text-sm">
            Inability to delegate appropriately
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="equipmentFailure" 
            checked={criteria.equipmentFailure}
            onCheckedChange={() => handleCheckboxChange('equipmentFailure')}
          />
          <Label htmlFor="equipmentFailure" className="text-sm">
            Inability to properly operate equipment
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToEstablishAirway" 
            checked={criteria.failedToEstablishAirway}
            onCheckedChange={() => handleCheckboxChange('failedToEstablishAirway')}
          />
          <Label htmlFor="failedToEstablishAirway" className="text-sm">
            Failed to establish airway control when necessary
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToVentilate" 
            checked={criteria.failedToVentilate}
            onCheckedChange={() => handleCheckboxChange('failedToVentilate')}
          />
          <Label htmlFor="failedToVentilate" className="text-sm">
            Failed to ventilate patient when necessary
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToOxygenate" 
            checked={criteria.failedToOxygenate}
            onCheckedChange={() => handleCheckboxChange('failedToOxygenate')}
          />
          <Label htmlFor="failedToOxygenate" className="text-sm">
            Failed to oxygenate patient when necessary
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToControlBleeding" 
            checked={criteria.failedToControlBleeding}
            onCheckedChange={() => handleCheckboxChange('failedToControlBleeding')}
          />
          <Label htmlFor="failedToControlBleeding" className="text-sm">
            Failed to control bleeding
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToProtectSpine" 
            checked={criteria.failedToProtectSpine}
            onCheckedChange={() => handleCheckboxChange('failedToProtectSpine')}
          />
          <Label htmlFor="failedToProtectSpine" className="text-sm">
            Failed to properly protect spinal cord when needed
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToAssessPatient" 
            checked={criteria.failedToAssessPatient}
            onCheckedChange={() => handleCheckboxChange('failedToAssessPatient')}
          />
          <Label htmlFor="failedToAssessPatient" className="text-sm">
            Failed to assess patient thoroughly
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToProvideInterventions" 
            checked={criteria.failedToProvideInterventions}
            onCheckedChange={() => handleCheckboxChange('failedToProvideInterventions')}
          />
          <Label htmlFor="failedToProvideInterventions" className="text-sm">
            Failed to provide appropriate interventions
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="failedToTransport" 
            checked={criteria.failedToTransport}
            onCheckedChange={() => handleCheckboxChange('failedToTransport')}
          />
          <Label htmlFor="failedToTransport" className="text-sm">
            Failed to transport when appropriate
          </Label>
        </div>
      </div>
    </div>
  );
};

export default CriticalCriteriaSection;
