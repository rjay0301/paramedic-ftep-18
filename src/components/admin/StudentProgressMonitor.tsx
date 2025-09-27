
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudentProgress } from '@/hooks/admin/useStudentProgress';
import { Search, RefreshCw, ChevronRight, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const StudentProgressMonitor: React.FC = () => {
  const {
    students,
    selectedStudent,
    setSelectedStudent,
    phaseProgress,
    loading,
    phaseLoading,
    refreshProgress,
    recalculateProgress
  } = useStudentProgress();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Student Progress Monitor</CardTitle>
          <Button 
            onClick={() => refreshProgress()} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading student progress data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-right">Progress</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow 
                            key={student.id} 
                            className={selectedStudent === student.id ? 'bg-muted/50' : ''}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{student.full_name || 'N/A'}</span>
                                <span className="text-xs text-gray-500">{student.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <span className="text-sm mr-2">{student.overall_percentage}%</span>
                                <div className="w-16">
                                  <Progress value={student.overall_percentage} className="h-2" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedStudent(student.id)}
                                aria-label="View details"
                              >
                                <ChevronRight size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                            {searchTerm ? 'No matching students found' : 'No students available'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                {selectedStudent ? (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg">
                        {students.find(s => s.id === selectedStudent)?.full_name || 'Student'} - Phase Progress
                      </CardTitle>
                      <Button 
                        onClick={() => recalculateProgress(selectedStudent)} 
                        size="sm"
                      >
                        <Activity size={16} className="mr-2" />
                        Recalculate Progress
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {phaseLoading ? (
                        <div className="flex items-center justify-center h-48">
                          <p className="text-gray-500">Loading phase data...</p>
                        </div>
                      ) : (
                        <div className="border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Phase</TableHead>
                                <TableHead>Completed</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {phaseProgress.length > 0 ? (
                                phaseProgress.map((phase) => (
                                  <TableRow key={phase.id}>
                                    <TableCell className="font-medium">
                                      {phase.phase_name.replace(/_/g, ' ')}
                                    </TableCell>
                                    <TableCell>{phase.completed_items}</TableCell>
                                    <TableCell>{phase.total_items}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <div className="w-full max-w-[120px] mr-2">
                                          <Progress value={phase.completion_percentage} className="h-2" />
                                        </div>
                                        <span className="text-sm">{phase.completion_percentage}%</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {phase.is_complete ? (
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                          Complete
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                          In Progress
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No phase progress data available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4 bg-gray-50">
                          <h3 className="text-sm font-medium mb-2">Forms Completion</h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {students.find(s => s.id === selectedStudent)?.completed_forms || 0} of {students.find(s => s.id === selectedStudent)?.total_forms || 0} forms completed
                            </span>
                            <span className="text-sm font-medium">
                              {Math.round(((students.find(s => s.id === selectedStudent)?.completed_forms || 0) / (students.find(s => s.id === selectedStudent)?.total_forms || 1)) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.round(((students.find(s => s.id === selectedStudent)?.completed_forms || 0) / (students.find(s => s.id === selectedStudent)?.total_forms || 1)) * 100)} 
                            className="h-2" 
                          />
                        </div>
                        
                        <div className="border rounded-md p-4 bg-gray-50">
                          <h3 className="text-sm font-medium mb-2">Phases Completion</h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {students.find(s => s.id === selectedStudent)?.completed_phases || 0} of {students.find(s => s.id === selectedStudent)?.total_phases || 0} phases completed
                            </span>
                            <span className="text-sm font-medium">
                              {Math.round(((students.find(s => s.id === selectedStudent)?.completed_phases || 0) / (students.find(s => s.id === selectedStudent)?.total_phases || 1)) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.round(((students.find(s => s.id === selectedStudent)?.completed_phases || 0) / (students.find(s => s.id === selectedStudent)?.total_phases || 1)) * 100)} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full border rounded-md p-8 bg-gray-50">
                    <Activity size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-1">No Student Selected</h3>
                    <p className="text-sm text-gray-400 text-center">
                      Select a student from the list to view detailed progress information
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressMonitor;
