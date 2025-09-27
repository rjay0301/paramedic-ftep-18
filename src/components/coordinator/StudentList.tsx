
import React, { useState } from 'react';
import { Mail, Phone, Download, Search, Menu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Student, Phase } from '@/types/coordinator';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface StudentListProps {
  students: Student[];
  phases: Phase[];
  onViewStudent: (student: Student) => void;
  onGeneratePdf: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  phases, 
  onViewStudent, 
  onGeneratePdf 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('All Phases');
  const isMobile = useIsMobile();

  // Get progress color based on completion percentage
  const getProgressColor = (progress: number) => {
    if (progress < 50) return "bg-red-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Define phase groupings
  const phaseGroups = {
    'Phase 1': ['Observational Phase', 'Rural Ambulance', 'Not Started'],
    'Phase 2': ['Instructional Phase', 'Instructional Shift Evaluation', 'Instructional Case Summaries'],
    'Phase 3': ['Independent Phase', 'Independent Shift Evaluation', 'Independent Case Summaries'],
    'Phase 4': ['Declaration', 'Reflective Practice', 'Final Evaluation']
  };

  // Filter students based on search term and selected phase
  const filteredStudents = students.filter(student => {
    // Apply search filter - improved to handle missing names
    if (searchTerm) {
      const studentName = student.name || '';
      const studentEmail = student.email || '';
      if (!studentName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !studentEmail.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
    }
    
    // Apply phase filter
    if (selectedPhase !== 'All Phases') {
      // If it's a phase group, check if student's phase is in that group
      const phasesInGroup = phaseGroups[selectedPhase as keyof typeof phaseGroups] || [];
      return phasesInGroup.includes(student.phase);
    }
    
    return true;
  });

  // Get student initials safely
  const getStudentInitials = (name: string): string => {
    if (!name || name === 'Unknown') return 'U';
    return name.split(' ').map(n => n?.[0] || '').join('').toUpperCase() || 'U';
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <div className="p-3 sm:p-4 border-b">
          <h3 className="font-semibold text-base sm:text-lg">All Students</h3>
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 justify-between mb-4 gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search students..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Phase Filter - Only showing Phase 1-4 */}
            <div>
              <select 
                className="border rounded-lg py-2 px-3 sm:px-4 focus:ring-primary focus:border-primary w-full md:w-auto text-sm"
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                aria-label="Filter by phase"
              >
                <option>All Phases</option>
                <option>Phase 1</option>
                <option>Phase 2</option>
                <option>Phase 3</option>
                <option>Phase 4</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Students List */}
          {isMobile && (
            <div className="space-y-4">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Card key={student.id} className="overflow-hidden">
                    <div className="p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold">
                        {getStudentInitials(student.name)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</h4>
                        <p className="text-xs text-gray-500">{student.hub || 'No Hub Assigned'}</p>
                        
                        <div className="mt-2">
                          <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 px-2 py-0.5">
                            {student.phase}
                          </span>
                        </div>
                        
                        <div className="mt-3">
                          <Progress 
                            value={student.progress} 
                            className={`h-2 mb-1 ${getProgressColor(student.progress)}`} 
                          />
                          <div className="text-xs text-gray-500">{student.progress}% complete</div>
                        </div>
                        
                        <div className="mt-3 flex space-x-4">
                          {student.email && (
                            <a 
                              href={`mailto:${student.email}`}
                              className="text-gray-600 hover:text-primary"
                              aria-label={`Email ${student.name}`}
                            >
                              <Mail size={16} />
                            </a>
                          )}
                          {student.phone && (
                            <a 
                              href={`tel:${student.phone}`}
                              className="text-gray-600 hover:text-primary"
                              aria-label={`Call ${student.name}`}
                            >
                              <Phone size={16} />
                            </a>
                          )}
                          <button 
                            className="text-gray-600 hover:text-gray-900 ml-auto"
                            title="Generate PDF Report"
                            onClick={() => onGeneratePdf(student.id)}
                            aria-label={`Generate PDF report for ${student.name}`}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onViewStudent(student)}
                      className="w-full py-2 bg-gray-50 text-primary text-sm hover:bg-gray-100 border-t"
                    >
                      View Details
                    </button>
                  </Card>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4 text-sm">
                  {searchTerm || selectedPhase !== 'All Phases' 
                    ? 'No students match your search criteria' 
                    : 'No students found'}
                </div>
              )}
            </div>
          )}
          
          {/* Desktop Students Table */}
          {!isMobile && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold">
                              {getStudentInitials(student.name)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{student.hub || 'No Hub Assigned'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                            {student.phase}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Progress 
                            value={student.progress} 
                            className={`h-2.5 mb-1 ${getProgressColor(student.progress)}`} 
                          />
                          <div className="text-xs text-gray-500">{student.progress}% complete</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {student.email && (
                              <button 
                                className="text-gray-600 hover:text-primary"
                                title={`Email ${student.name || 'Student'}`}
                                onClick={() => window.open(`mailto:${student.email}`)}
                                aria-label={`Email ${student.name || 'Student'}`}
                              >
                                <Mail size={18} />
                              </button>
                            )}
                            {student.phone && (
                              <button 
                                className="text-gray-600 hover:text-primary"
                                title={`Call ${student.name || 'Student'}`}
                                onClick={() => window.open(`tel:${student.phone}`)}
                                aria-label={`Call ${student.name || 'Student'}`}
                              >
                                <Phone size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => onViewStudent(student)}
                            className="text-primary hover:text-primary-dark mr-3"
                          >
                            View
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            title="Generate PDF Report"
                            onClick={() => onGeneratePdf(student.id)}
                            aria-label={`Generate PDF report for ${student.name || 'Student'}`}
                          >
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        {searchTerm || selectedPhase !== 'All Phases' 
                          ? 'No students match your search criteria' 
                          : 'No students found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentList;
