
import React from 'react';
import { EvaluationScore } from '@/types';

interface ClinicalPerformanceEvaluationProps {
  clinicalPerformance: Record<string, EvaluationScore>;
  onClinicalPerformanceChange: (field: string, value: EvaluationScore) => void;
  disabled?: boolean;
}

export const ClinicalPerformanceTable: React.FC<ClinicalPerformanceEvaluationProps> = ({
  clinicalPerformance,
  onClinicalPerformanceChange,
  disabled = false
}) => {
  const performanceLabels = {
    patient_assessment: "Patient Assessment",
    assessment_skills: "Assessment Skills",
    history_taking: "History Taking",
    ncc_ctl_update: "NCC and CTL Update",
    scene_control: "Scene Control",
    patient_movement: "Patient Movement",
    provisional_diagnosis: "Clinical Decision Making - Provisional Diagnosis",
    recognizing_severity: "Clinical Decision Making - Recognizing Severity",
    treatment_plan: "Clinical Decision Making - Treatment Plan",
    priority_to_hospital: "Clinical Decision Making - Priority to Hospital",
    trauma_management: "Trauma Management",
    cardiac_management: "Cardiac Management",
    medical_management: "Medical Management",
    pediatric_management: "Pediatric Management",
    airway_management: "Airway Management",
    medication_admin: "Medication Administration",
    equipment: "Equipment",
    handover: "Handover",
    pcr_documentation: "PCR Documentation",
    patient_communication: "Patient Communication"
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
              Category
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              3
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              2
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              1
            </th>
            <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              N.P.
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(performanceLabels).map(([field, label]) => (
            <tr key={field} className={disabled ? "bg-gray-50" : ""}>
              <td className="px-3 py-4 whitespace-normal text-sm text-gray-900">
                {label}
              </td>
              {[3, 2, 1, "N.P."].map((score) => (
                <td key={`${field}-${score}`} className="px-3 py-4 whitespace-nowrap text-center">
                  <input
                    type="radio"
                    id={`${field}-${score}`}
                    name={field}
                    checked={clinicalPerformance[field] === score}
                    onChange={() => onClinicalPerformanceChange(field, score as EvaluationScore)}
                    disabled={disabled}
                    className="h-4 w-4 text-primary focus:ring-primary-500 border-gray-300 cursor-pointer"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
