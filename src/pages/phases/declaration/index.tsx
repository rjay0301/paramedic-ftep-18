
import React from 'react';
import DeclarationForm from './DeclarationForm';
import PageHeader from '@/components/common/PageHeader';

const DeclarationPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader 
          title="Declaration of Readiness" 
          subtitle="Confirm readiness for final evaluation" 
        />
        
        <div className="p-4 md:p-6">
          <DeclarationForm />
        </div>
      </div>
    </div>
  );
};

export default DeclarationPage;
