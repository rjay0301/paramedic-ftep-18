
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Assignment } from '@/types';
import { Trash2 } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onViewAssignment: (assignment: Assignment) => void;
  onDeleteAssignment?: (assignment: Assignment) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ 
  assignment, 
  onViewAssignment,
  onDeleteAssignment
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            Submitted
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{assignment.title}</h3>
          {getStatusBadge(assignment.status)}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewAssignment(assignment)}
        >
          View Details
        </Button>
        
        {onDeleteAssignment && (
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8" 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDeleteAssignment(assignment);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssignmentCard;
