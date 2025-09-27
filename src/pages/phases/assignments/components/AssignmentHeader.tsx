
import React from 'react';

interface AssignmentHeaderProps {
  assignmentNumber: string;
  title: string;
  description: string;
}

const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({ 
  assignmentNumber, 
  title, 
  description 
}) => {
  return (
    <>
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        Assignment {assignmentNumber}: {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </>
  );
};

export default AssignmentHeader;
