
import React from 'react';

interface DiagnosticResultProps {
  diagnosticResult: {
    validationResult?: {
      inconsistencies: string[];
    } | null;
  } | null;
}

const DiagnosticResults: React.FC<DiagnosticResultProps> = ({ diagnosticResult }) => {
  if (!diagnosticResult || !diagnosticResult.validationResult || diagnosticResult.validationResult.inconsistencies.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-yellow-800 font-medium">Progress Issues Detected</h3>
      <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
        {diagnosticResult.validationResult.inconsistencies.map((issue: string, index: number) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
      <p className="text-yellow-600 text-sm mt-2">
        Click "Fix Progress" above to automatically resolve these issues.
      </p>
    </div>
  );
};

export default DiagnosticResults;
