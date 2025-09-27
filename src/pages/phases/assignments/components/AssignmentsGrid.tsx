
import React from 'react';
import { Assignment } from '@/types';
import AssignmentCard from './AssignmentCard';

interface AssignmentsGridProps {
  assignments: Assignment[];
  onViewAssignment: (assignment: Assignment) => void;
  onDeleteAssignment?: (assignment: Assignment) => void;
}

const AssignmentsGrid: React.FC<AssignmentsGridProps> = ({ 
  assignments, 
  onViewAssignment,
  onDeleteAssignment
}) => {
  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No assignments available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {assignments.map(assignment => (
        <AssignmentCard 
          key={assignment.id}
          assignment={assignment}
          onViewAssignment={onViewAssignment}
          onDeleteAssignment={onDeleteAssignment}
        />
      ))}
    </div>
  );
};

export default AssignmentsGrid;
