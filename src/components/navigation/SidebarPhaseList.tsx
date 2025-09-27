
import React from 'react';
import { FileText, Folder } from 'lucide-react';
import { PhaseItem } from '@/types';
import { toast } from 'sonner';
import { isAddendumPhase } from '@/utils/validation';
import PhaseSection from './PhaseSection';

interface SidebarPhaseListProps {
  phases: PhaseItem[];
  onPhaseSelect: (phase: PhaseItem) => void;
  onClose: () => void;
}

const SidebarPhaseList: React.FC<SidebarPhaseListProps> = ({ 
  phases, 
  onPhaseSelect,
  onClose
}) => {
  const [expandedPhases, setExpandedPhases] = React.useState(true);
  const [expandedAddendum, setExpandedAddendum] = React.useState(true);
  
  const togglePhasesExpansion = () => {
    setExpandedPhases(!expandedPhases);
  };
  
  const toggleAddendumExpansion = () => {
    setExpandedAddendum(!expandedAddendum);
  };
  
  const handlePhaseClick = (phase: PhaseItem) => {
    if (phase.locked) {
      toast.error("This phase is locked. Complete the previous phases to unlock it.");
      return;
    }
    onPhaseSelect(phase);
    onClose();
  };

  // Group the phases by their categories
  const categorizePhases = () => {
    // Regular forms (excluding addendum items)
    const regularForms = phases.filter(phase => !isAddendumPhase(phase.id));
    
    // Addendum items
    const addendumForms = phases.filter(phase => isAddendumPhase(phase.id));
    
    // Group regular forms into logical categories
    const initialPhases = regularForms.filter(phase => 
      ['assignments', 'rural-ambulance', 'observation'].includes(phase.id)
    );
    
    const instructionalPhases = regularForms.filter(phase => 
      ['instructional', 'instructional-evaluation', 'instructional-summaries'].includes(phase.id)
    );
    
    const independentPhases = regularForms.filter(phase => 
      ['independent', 'independent-evaluation', 'independent-summaries'].includes(phase.id)
    );
    
    const finalPhases = regularForms.filter(phase => 
      ['reflective', 'final-evaluation', 'evaluation-forms'].includes(phase.id)
    );
    
    return {
      initialPhases,
      instructionalPhases,
      independentPhases,
      finalPhases,
      addendumForms
    };
  };
  
  const {
    initialPhases,
    instructionalPhases,
    independentPhases,
    finalPhases,
    addendumForms
  } = categorizePhases();

  return (
    <div className="mt-4 space-y-2">
      {/* All Forms Section */}
      <PhaseSection 
        title="Initial Forms"
        phases={initialPhases}
        expanded={expandedPhases}
        toggleExpansion={togglePhasesExpansion}
        onPhaseClick={handlePhaseClick}
        icon={<FileText size={18} className="mr-2" />}
      />
      
      {/* Instructional Phase Section */}
      <PhaseSection 
        title="Instructional Phase"
        phases={instructionalPhases}
        expanded={expandedPhases}
        toggleExpansion={togglePhasesExpansion}
        onPhaseClick={handlePhaseClick}
        icon={<FileText size={18} className="mr-2" />}
      />
      
      {/* Independent Phase Section */}
      <PhaseSection 
        title="Independent Phase"
        phases={independentPhases}
        expanded={expandedPhases}
        toggleExpansion={togglePhasesExpansion}
        onPhaseClick={handlePhaseClick}
        icon={<FileText size={18} className="mr-2" />}
      />
      
      {/* Final Evaluation Section */}
      <PhaseSection 
        title="Final Evaluation"
        phases={finalPhases}
        expanded={expandedPhases}
        toggleExpansion={togglePhasesExpansion}
        onPhaseClick={handlePhaseClick}
        icon={<FileText size={18} className="mr-2" />}
      />

      {/* Addendum Section */}
      <PhaseSection 
        title="Addendum"
        phases={addendumForms}
        expanded={expandedAddendum}
        toggleExpansion={toggleAddendumExpansion}
        onPhaseClick={handlePhaseClick}
        icon={<Folder size={18} className="mr-2" />}
      />
    </div>
  );
};

export default SidebarPhaseList;
