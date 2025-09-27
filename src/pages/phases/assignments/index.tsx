
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAssignments } from '@/hooks/useAssignments';
import AssignmentForm from './components/AssignmentForm';
import ErrorDisplay from './components/ErrorDisplay';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assignment1');
  const { 
    assignments,
    isLoading,
    isSaving,
    submittedAssignments,
    fetchAttempted,
    fetchError,
    handleChange,
    handleSaveDraft,
    handleSubmit,
    fetchAssignments,
    resetErrors
  } = useAssignments();

  useEffect(() => {
    if (fetchError) {
      toast.error(fetchError);
    }
  }, [fetchError]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh] flex-col">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading assignments...</p>
      </div>
    );
  }

  // Show error state with retry button
  if (fetchError && !isLoading) {
    return <ErrorDisplay error={fetchError} onRetry={() => { resetErrors(); fetchAssignments(); }} />;
  }

  // Show empty state if no data was fetched
  if (!fetchAttempted && !isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-gray-600">Failed to load assignments. Please try again.</p>
        <button 
          onClick={() => fetchAssignments()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render assignment tabs
  const tabList = (
    <TabsList className="mb-6 flex flex-wrap gap-2">
      {Array.from({ length: 6 }, (_, i) => {
        const tabKey = `assignment${i + 1}`;
        const isSubmitted = submittedAssignments.includes(tabKey);
        
        return (
          <TabsTrigger 
            key={tabKey} 
            value={tabKey} 
            onClick={() => setActiveTab(tabKey)}
            className={isSubmitted ? "border-green-500 border" : ""}
          >
            Assignment {i + 1} {isSubmitted ? "✓" : ""}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );

  // Render assignment content
  const tabContent = (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const tabKey = `assignment${i + 1}`;
        return (
          <TabsContent key={tabKey} value={tabKey}>
            <AssignmentForm
              assignmentTab={tabKey}
              value={assignments[tabKey]?.content || ''}
              isSubmitted={submittedAssignments.includes(tabKey)}
              isDisabled={false}
              onChange={(value) => handleChange(tabKey, 'content', value)}
              onSaveDraft={() => handleSaveDraft(tabKey)}
              onSubmit={() => handleSubmit(tabKey)}
              isSubmitting={isSaving}
              isSaving={isSaving}
            />
          </TabsContent>
        );
      })}
    </>
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      <Tabs defaultValue={activeTab} className="w-full max-w-3xl mx-auto">
        {tabList}
        {tabContent}
      </Tabs>
    </div>
  );
};

export default AssignmentsPage;
