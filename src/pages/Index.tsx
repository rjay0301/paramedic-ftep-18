
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ChevronRight, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { phaseGroups, isPhaseAccessible } from '@/utils/validation';
import { useAuth } from '@/contexts/auth';
import { PhaseItem } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock completed phases for demonstration
  const [completedPhases] = useState<string[]>(['observation']);
  
  // Define all application phases with their details
  const allPhases: PhaseItem[] = [
    { id: 'assignments', name: 'Assignments', completed: 3, total: 6, locked: false },
    { id: 'rural-ambulance', name: 'Rural Ambulance', completed: 2, total: 2, locked: false },
    { id: 'observation', name: 'Observation', completed: 2, total: 2, locked: false },
    { id: 'instructional', name: 'Instructional Phase', completed: 3, total: 6, locked: !isPhaseAccessible('instructional', completedPhases) },
    { id: 'instructional-evaluation', name: 'Instructional Shift Evaluation', completed: 2, total: 6, locked: !isPhaseAccessible('instructional-evaluation', completedPhases) },
    { id: 'instructional-summaries', name: 'Instructional Case Summaries', completed: 5, total: 20, locked: !isPhaseAccessible('instructional-summaries', completedPhases) },
    { id: 'independent', name: 'Independent Phase', completed: 0, total: 6, locked: !isPhaseAccessible('independent', completedPhases) },
    { id: 'independent-evaluation', name: 'Independent Shift Evaluation', completed: 0, total: 6, locked: !isPhaseAccessible('independent-evaluation', completedPhases) },
    { id: 'independent-summaries', name: 'Independent Case Summaries', completed: 0, total: 10, locked: !isPhaseAccessible('independent-summaries', completedPhases) },
    { id: 'reflective', name: 'Reflective Practice Report', completed: 0, total: 1, locked: !isPhaseAccessible('reflective', completedPhases) },
    { id: 'final-evaluation', name: 'Declaration for Final Evaluation', completed: 0, total: 1, locked: !isPhaseAccessible('final-evaluation', completedPhases) },
    { id: 'evaluation-forms', name: 'Final Evaluation', completed: 0, total: 4, locked: !isPhaseAccessible('evaluation-forms', completedPhases) },
  ];
  
  // Group phases by category for display
  const phaseCategories = {
    'Always Accessible': allPhases.filter(phase => 
      phaseGroups.alwaysAccessible.includes(phase.id) || phaseGroups.phase1.includes(phase.id)
    ),
    'Instructional Phase': allPhases.filter(phase => phaseGroups.phase2.includes(phase.id)),
    'Independent Phase': allPhases.filter(phase => phaseGroups.phase3.includes(phase.id)),
    'Final Evaluation': allPhases.filter(phase => phaseGroups.phase4.includes(phase.id)),
  };
  
  // Calculate overall progress
  const totalForms = allPhases.reduce((sum, phase) => sum + phase.total, 0);
  const completedForms = allPhases.reduce((sum, phase) => sum + phase.completed, 0);
  const progressPercentage = Math.round((completedForms / totalForms) * 100);
  
  const handlePhaseSelect = (phase: PhaseItem) => {
    if (phase.locked) {
      toast.error("This phase is locked. Complete the previous phases to unlock it.");
      return;
    }
    navigate(`/phase/${phase.id}`);
  };
  
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to Paramedic FTEP Workbook</h1>
          <p className="text-gray-600">Track your progress and complete your training forms</p>
        </div>
        
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-3">Overall Progress</h2>
          <Progress value={progressPercentage} className="h-4 mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span className="font-medium">{progressPercentage}% complete</span>
            <span>{completedForms}/{totalForms} forms</span>
          </div>
        </div>
        
        {Object.entries(phaseCategories).map(([category, phases]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {phases.map(phase => (
                <div 
                  key={phase.id} 
                  className={`bg-white rounded-xl shadow-md p-5 ${phase.locked ? 'opacity-80' : 'card-hover cursor-pointer'}`}
                  onClick={() => handlePhaseSelect(phase)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      {phase.completed === phase.total ? (
                        <CheckCircle size={20} className="text-green-500 mr-2" />
                      ) : phase.locked ? (
                        <Lock size={20} className="text-yellow-500 mr-2" />
                      ) : (
                        <Book size={20} className="text-primary-500 mr-2" />
                      )}
                      <h3 className="font-medium">{phase.name}</h3>
                    </div>
                    {!phase.locked && <ChevronRight size={18} className="text-gray-400" />}
                  </div>
                  <Progress 
                    value={(phase.completed / phase.total) * 100} 
                    className={`h-3 mb-2 ${phase.completed === phase.total ? 'bg-green-500' : ''}`}
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{phase.completed}/{phase.total} completed</span>
                    <span>{Math.round((phase.completed / phase.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
