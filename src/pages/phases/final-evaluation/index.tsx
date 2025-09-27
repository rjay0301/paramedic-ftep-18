
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinalEvaluationForm from './FinalEvaluationForm';
import { FinalEvaluationFormData } from '@/types/finalEvaluation';

const FinalEvaluationPage = () => {
  const [activeTab, setActiveTab] = useState('form-1');

  // Initialize with 6 forms
  const [forms, setForms] = useState<Record<string, FinalEvaluationFormData | null>>({
    'form-1': null,
    'form-2': null,
    'form-3': null,
    'form-4': null,
    'form-5': null,
    'form-6': null,
  });

  const handleSave = (formData: FinalEvaluationFormData) => {
    setForms(prevForms => ({
      ...prevForms,
      [activeTab]: formData
    }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6 text-center">
      <PageHeader
        title="Final Evaluation"
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex overflow-x-auto pb-2 mb-2 space-x-1 border-b border-gray-200">
          <TabsTrigger value="form-1" className="flex-shrink-0">Form 1</TabsTrigger>
          <TabsTrigger value="form-2" className="flex-shrink-0">Form 2</TabsTrigger>
          <TabsTrigger value="form-3" className="flex-shrink-0">Form 3</TabsTrigger>
          <TabsTrigger value="form-4" className="flex-shrink-0">Form 4</TabsTrigger>
          <TabsTrigger value="form-5" className="flex-shrink-0">Form 5</TabsTrigger>
          <TabsTrigger value="form-6" className="flex-shrink-0">Form 6</TabsTrigger>
        </TabsList>

        <TabsContent value="form-1">
          <FinalEvaluationForm 
            evaluationNumber={1}
            onSubmit={handleSave}
            onSaveDraft={handleSave}
          />
        </TabsContent>
        <TabsContent value="form-2">
          <FinalEvaluationForm 
            evaluationNumber={2}
            onSubmit={handleSave}
            onSaveDraft={handleSave}
          />
        </TabsContent>
        <TabsContent value="form-3">
          <FinalEvaluationForm 
            evaluationNumber={3}
            onSubmit={handleSave}
            onSaveDraft={handleSave}
          />
        </TabsContent>
        <TabsContent value="form-4">
          <FinalEvaluationForm 
            evaluationNumber={4}
            onSubmit={handleSave}
            onSaveDraft={handleSave}
          />
        </TabsContent>
        <TabsContent value="form-5">
          <FinalEvaluationForm 
            evaluationNumber={5}
            onSubmit={handleSave}
            onSaveDraft={handleSave}
          />
        </TabsContent>
        <TabsContent value="form-6">
          <FinalEvaluationForm 
            evaluationNumber={6}
            onSubmit={handleSave}
            onSaveDraft={handleSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinalEvaluationPage;
