
import React from 'react';
import { Users, BarChart2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Student, Phase, RecentActivity } from '@/types/coordinator';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface CoordinatorDashboardProps {
  students: Student[];
  phases: Phase[];
  recentActivities: RecentActivity[];
}

const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({ 
  students, 
  phases, 
  recentActivities 
}) => {
  const isMobile = useIsMobile();
  
  // Calculate statistics
  const calculateStatistics = () => {
    const totalStudents = students.length;
    const averageProgress = totalStudents > 0 
      ? Math.round(students.reduce((acc, student) => acc + student.progress, 0) / totalStudents) 
      : 0;
    const completedStudents = students.filter(s => s.progress >= 90).length;
    
    return { totalStudents, averageProgress, completedStudents };
  };

  // Calculate the number of students who have completed each phase
  const calculatePhaseCompletion = (phases: Phase[]) => {
    return phases.map(phase => {
      // Count students who have completed this phase
      // This is a simplified approach - in production, you would have a more accurate
      // way to determine which students have completed which phases
      const studentsCompletedPhase = students.filter(student => {
        // If student has phase-related forms or their progress indicates completion
        // This is just a stub implementation and should be customized based on actual data structure
        if (phase.phase === 'Phase 1: Observation') {
          return student.progress >= 25;
        } else if (phase.phase === 'Phase 2: Instructional') {
          return student.progress >= 50;
        } else if (phase.phase === 'Phase 3: Independent') {
          return student.progress >= 75;
        } else if (phase.phase === 'Phase 4: Evaluation') {
          return student.progress >= 90;
        }
        return false;
      }).length;
      
      return {
        ...phase,
        studentsCompleted: studentsCompletedPhase
      };
    });
  };

  const stats = calculateStatistics();
  const phasesWithCompletion = calculatePhaseCompletion(phases);

  return (
    <div className="p-4 sm:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <Card className="h-full">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-2">Total Students</h3>
            <div className="flex items-center">
              <div className="text-xl sm:text-3xl font-bold">{stats.totalStudents}</div>
              <Users size={isMobile ? 16 : 20} className="ml-2 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-2">Average Progress</h3>
            <div className="flex items-center">
              <div className="text-xl sm:text-3xl font-bold">
                {stats.averageProgress}%
              </div>
              <BarChart2 size={isMobile ? 16 : 20} className="ml-2 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-2">Completed Students</h3>
            <div className="flex items-center">
              <div className="text-xl sm:text-3xl font-bold">
                {stats.completedStudents}
              </div>
              <FileText size={isMobile ? 16 : 20} className="ml-2 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Phase Progress */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Phase Progress</h3>
            <div className="space-y-4">
              {phasesWithCompletion.map((phase) => (
                <div key={phase.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium">{phase.phase}</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {phase.studentsCompleted}/{stats.totalStudents} students
                    </span>
                  </div>
                  <Progress 
                    value={(phase.studentsCompleted / stats.totalStudents) * 100} 
                    className="h-2 sm:h-2.5" 
                  />
                </div>
              ))}
              
              {/* Placeholder when no phases data */}
              {phases.length === 0 && (
                <div className="text-center text-gray-500 py-4 text-xs sm:text-sm">
                  No phase data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Recent Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity) => {
                const colorMap: Record<string, string> = {
                  'green': 'border-green-500',
                  'blue': 'border-blue-500',
                  'yellow': 'border-yellow-500',
                  'red': 'border-red-500'
                };
                const colorClass = colorMap[activity.color || 'blue'] || 'border-blue-500';
                
                return (
                  <div key={activity.id} className={`border-l-4 ${colorClass} pl-3 sm:pl-4 py-2`}>
                    <p className="text-xs sm:text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                );
              })}
              
              {/* Placeholder when no activity data */}
              {recentActivities.length === 0 && (
                <div className="text-center text-gray-500 py-4 text-xs sm:text-sm">
                  No recent activities to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
