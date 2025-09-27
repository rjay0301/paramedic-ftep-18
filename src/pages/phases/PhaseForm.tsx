
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/layout/Header';
import { getPhases, getCompletedPhases } from '@/services/formService';
import { PhaseItem } from '@/types';
import RuralAmbulanceForm from './rural-ambulance';
import ObservationalPhase from './observational/index';
import InstructionalPhase from './instructional';
import AssignmentsForm from './assignments/index';
import InstructionalShiftEvaluationPhase from './instructional-evaluation';
import InstructionalSummariesPage from './instructional-summaries/InstructionalSummariesPage';
import IndependentPhase from './independent';
import IndependentSummariesPage from './independent-summaries';
import IndependentShiftEvaluationPage from './independent-evaluation';
import ReflectivePracticePage from './reflective';
import DeclarationPage from './declaration';
import FinalEvaluationPage from './final-evaluation';
import { useIsMobile } from '@/hooks/use-mobile';
import { isPhaseAccessible, isAddendumPhase } from '@/utils/validation';
import { useDebug } from '@/contexts/DebugContext';

// Define phases that should not show the back button in PhaseForm
// because they handle their own navigation
const PHASES_WITH_CUSTOM_NAVIGATION = ['rural-ambulance', 'independent'];

const PhaseForm = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
    // Check if the phase is locked (except in debug mode)
    if (phaseId && !shouldUnlockPhases && !isPhaseAccessible(phaseId, completedPhases)) {
      toast.error("This phase is locked. Complete the previous phases to unlock it.");
      navigate('/dashboard');
    }
  }, [phaseId, navigate, shouldUnlockPhases, completedPhases]);
  
  const handlePhaseSelect = (phase: PhaseItem) => {
    navigate(`/phase/${phase.id}`);
    setIsSidebarOpen(false);
  };
  
  const getBasePhaseId = (id: string | undefined): string => {
    if (!id) return '';
    
    // Strip any 'copy-X' suffix for addendum forms to map to the original component
    if (isAddendumPhase(id)) {
      const baseFormMap: Record<string, string> = {
        'instructional-copy-': 'instructional',
        'instructional-evaluation-copy-': 'instructional-evaluation',
        'independent-copy-': 'independent',
        'independent-evaluation-copy-': 'independent-evaluation',
        'final-evaluation-copy-': 'evaluation-forms'
      };
      
      for (const [prefix, baseForm] of Object.entries(baseFormMap)) {
        if (id.startsWith(prefix)) {
          return baseForm;
        }
      }
    }
    
    return id;
  };
  
  const renderPhaseContent = () => {
    // Use the base phase ID to determine which component to render
    const basePhaseId = getBasePhaseId(phaseId);
    
    switch (basePhaseId) {
      case 'rural-ambulance':
        return <RuralAmbulanceForm />;
      case 'observation':
        return <ObservationalPhase />;
      case 'instructional':
        return <InstructionalPhase />;
      case 'assignments':
        return <AssignmentsForm />;
      case 'instructional-evaluation':
        return <InstructionalShiftEvaluationPhase />;
      case 'instructional-summaries':
        return <InstructionalSummariesPage />;
      case 'independent':
        return <IndependentPhase />;
      case 'independent-summaries':
        return <IndependentSummariesPage />;
      case 'independent-evaluation':
        return <IndependentShiftEvaluationPage />;
      case 'reflective':
        return <ReflectivePracticePage />;
      case 'final-evaluation':
        return <DeclarationPage />;
      case 'evaluation-forms':
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
  
  // Determine if the current phase is from the Addendum section
  const isCurrentAddendumPhase = phaseId && isAddendumPhase(phaseId);
  
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
        {isCurrentAddendumPhase && (
          <div className="mb-4 p-3 bg-primary-50 rounded-lg">
            <h1 className="font-bold text-primary-700 text-center">Addendum</h1>
          </div>
        )}
        {renderPhaseContent()}
      </div>
    </div>
  );
};

export default PhaseForm;
