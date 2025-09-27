
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/navigation/Sidebar';
import { getPhases, getCompletedPhases } from '@/services/formService';
import { PhaseItem } from '@/types';
import InstructionalPhase from './instructional';
import InstructionalShiftEvaluationPhase from './instructional-evaluation';
import IndependentPhase from './independent';
import IndependentShiftEvaluationPage from './independent-evaluation';
import FinalEvaluationPage from './final-evaluation';
import { useDebug } from '@/contexts/DebugContext';
import { isPhaseAccessible, isAddendumPhase } from '@/utils/validation';

const Phase2Form = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const { shouldUnlockPhases } = useDebug();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  
  // Fetch phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const phasesData = await getPhases();
        setPhases(phasesData);
        
        // Fetch completed phases
        const completedPhasesData = await getCompletedPhases();
        setCompletedPhases(completedPhasesData);
      } catch (error) {
        console.error('Error fetching phases:', error);
      }
    };
    
    fetchPhases();
  }, []);
  
  useEffect(() => {
    // Remove the "-2" suffix for validation and check if it's an addendum phase
    const basePhaseId = phaseId?.endsWith('-2') 
      ? phaseId.substring(0, phaseId.length - 2) 
      : phaseId;
    
    // Addendum forms are always accessible
    if (basePhaseId && isAddendumPhase(basePhaseId)) {
      return;
    }
    
    // Check if the phase is locked (except in debug mode)
    if (basePhaseId && !shouldUnlockPhases && !isPhaseAccessible(basePhaseId, completedPhases)) {
      toast.error("This phase is locked. Complete the previous phases to unlock it.");
      navigate('/dashboard');
    }
  }, [phaseId, navigate, shouldUnlockPhases, completedPhases]);
  
  const handlePhaseSelect = (phase: PhaseItem) => {
    if (phase.id.endsWith('-2')) {
      navigate(`/phase2/${phase.id}`);
    } else {
      navigate(`/phase/${phase.id}`);
    }
    setIsSidebarOpen(false);
  };
  
  const renderPhaseContent = () => {
    // In Phase2Form, we need to remove the "-2" suffix
    const basePhaseId = phaseId?.endsWith('-2') 
      ? phaseId.substring(0, phaseId.length - 2) 
      : phaseId;
    
    switch (basePhaseId) {
      case 'instructional':
        return <InstructionalPhase />;
      case 'instructional-evaluation':
        return <InstructionalShiftEvaluationPhase />;
      case 'independent':
        return <IndependentPhase />;
      case 'independent-evaluation':
        return <IndependentShiftEvaluationPage />;
      case 'final-evaluation':
        return <FinalEvaluationPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-semibold mb-4">Phase Not Found</h2>
            <p className="text-gray-500">The requested phase does not exist or is not yet implemented.</p>
            <Button
              className="mt-6"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div>
      <Header onMenuToggle={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        phases={phases} 
        onPhaseSelect={handlePhaseSelect}
        completedPhases={completedPhases}
      />
      
      <div className="max-w-4xl mx-auto p-4 pt-16 md:pt-24">
        <div className="mb-4 p-3 bg-primary-50 rounded-lg">
          <h1 className="font-bold text-primary-700 text-center">Addendum</h1>
        </div>
        {renderPhaseContent()}
      </div>
    </div>
  );
};

export default Phase2Form;
