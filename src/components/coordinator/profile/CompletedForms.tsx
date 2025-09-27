
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StudentForm } from '@/types/coordinator';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompletedFormsProps {
  forms: StudentForm[];
  onGenerateFormPdf: (formId: string) => void;
}

const CompletedForms: React.FC<CompletedFormsProps> = ({
  forms,
  onGenerateFormPdf
}) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <div className="p-3 sm:p-4 border-b">
        <h3 className="font-semibold text-sm sm:text-base">Completed Forms</h3>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {forms?.map((form) => (
            <div key={form.id} className="flex justify-between items-center p-2 sm:p-3 border rounded hover:bg-gray-50">
              <div>
                <div className="font-medium text-xs sm:text-sm">{form.name}</div>
                <div className="text-xs text-gray-500">Completed on {form.completedDate}</div>
              </div>
              <Button
                variant="ghost"
                size="icon" 
                onClick={() => onGenerateFormPdf(form.id)}
                aria-label={`Download ${form.name}`}
                className="h-8 w-8"
                type="button"
              >
                <Download size={isMobile ? 16 : 18} />
              </Button>
            </div>
          ))}
          
          {(!forms || forms.length === 0) && (
            <div className="text-center text-gray-500 py-4 text-xs sm:text-sm">
              No completed forms available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletedForms;
