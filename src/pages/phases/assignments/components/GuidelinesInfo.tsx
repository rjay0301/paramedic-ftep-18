
import React from 'react';
import { FileText } from 'lucide-react';

const GuidelinesInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
      <h3 className="text-blue-700 font-medium flex items-center">
        <FileText className="h-5 w-5 mr-2" /> Assignment Submission Guidelines
      </h3>
      <p className="text-blue-600 text-sm mt-2">
        Complete all six assignments to progress in your Field Training and Evaluation Program.
        Once submitted, assignments cannot be edited. Make sure to review your work before submission.
      </p>
    </div>
  );
};

export default GuidelinesInfo;
