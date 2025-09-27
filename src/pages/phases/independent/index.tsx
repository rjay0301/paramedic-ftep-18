
import React from 'react';
import IndependentPhaseForm from './IndependentPhaseForm';
import PageHeader from '@/components/common/PageHeader';

const IndependentPhase = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <PageHeader 
          title="Independent Phase" 
          subtitle="AP as Team Leader with FTP guidance" 
        />
        
        <div className="p-4 md:p-6">
          <IndependentPhaseForm />
        </div>
      </div>
    </div>
  );
};

export default IndependentPhase;
