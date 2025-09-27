
import React from 'react';
import { ChevronRight, Download, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PhaseType } from '@/services/pdf';
import { Student } from '@/types/coordinator';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileHeaderProps {
  student: Student;
  isPdfGenerating: boolean;
  onBackToList: () => void;
  onEditProfile: (studentId: string) => void;
  onGeneratePhasePdf: (phaseType: PhaseType) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  student,
  isPdfGenerating,
  onBackToList,
  onEditProfile,
  onGeneratePhasePdf
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 sm:p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-lg sm:text-xl font-bold mr-3 sm:mr-4">
          {student.name.split(' ').map(n => n?.[0] || '').join('')}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{student.name}</h2>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 mr-2">
              {student.phase}
            </span>
            <span>{student.hub}</span>
          </div>
        </div>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col w-full' : 'space-x-2'} ${isMobile ? 'space-y-2' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline"
              className="flex items-center justify-center text-xs sm:text-sm w-full"
              disabled={isPdfGenerating}
              aria-label="Generate PDF report"
            >
              <Download size={isMobile ? 14 : 16} className="mr-2" />
              {isPdfGenerating ? 'Generating...' : 'Generate PDF'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('initial')}>Initial Forms</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('instructional')}>Instructional Phase</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('independent')}>Independent Phase</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('reflective')}>Reflective Practice</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('declaration')}>Declaration of Readiness</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('evaluation')}>Final Evaluation</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('addendum')}>Addendum Forms</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onGeneratePhasePdf('complete')}>Complete Workbook</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          className="flex items-center justify-center text-xs sm:text-sm"
          onClick={() => onEditProfile(student.id)}
          aria-label="Edit profile"
        >
          <Edit size={isMobile ? 14 : 16} className="mr-2" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
