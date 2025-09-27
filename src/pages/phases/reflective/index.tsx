
import React from 'react';
import ReflectivePracticeForm from './ReflectivePracticeForm';
import PageHeader from '@/components/common/PageHeader';

const ReflectivePracticePage = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader 
          title="Reflective Practice Report" 
          subtitle="One detailed case report with structured reflection" 
        />
        
        <div className="p-4 md:p-6">
          <ReflectivePracticeForm />
        </div>
      </div>
    </div>
  );
};

export default ReflectivePracticePage;
