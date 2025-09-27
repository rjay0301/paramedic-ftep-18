import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';

const ObservationalPhaseForm = () => {
  const { phaseId } = useParams<{ phaseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      console.log('User in ObservationalPhaseForm:', user.email, user.role);
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Simulate saving data
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Form saved successfully!');
    } catch (error) {
      toast.error('Failed to save form.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Observational Phase Form</h1>
          <Badge variant="secondary">{phaseId}</Badge>
        </div>
        <Separator />
        <div className="p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="grid gap-4">
              <div>
                <label htmlFor="observationNotes" className="block text-sm font-medium leading-none mb-1">
                  Observation Notes
                </label>
                <textarea
                  id="observationNotes"
                  name="observationNotes"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your observation notes"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save
                    <Save className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ObservationalPhaseForm;
