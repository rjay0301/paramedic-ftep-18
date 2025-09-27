import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SignatureField from '@/components/common/SignatureField';

const formSchema = z.object({
  tripNumber: z.string().min(1, 'Trip Number is required'),
  callNarrative: z.string().min(1, 'Call narrative is required'),
  whatHappened: z.string().min(1, 'This field is required'),
  whatWentWell: z.string().min(1, 'This field is required'),
  whatCanBeImproved: z.string().min(1, 'This field is required'),
  whatYouLearned: z.string().min(1, 'This field is required'),
  conclusion: z.string().min(1, 'Conclusion is required'),
  studentSignature: z.string().min(1, 'Your signature is required'),
  ftpSignature: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

type FormValues = z.infer<typeof formSchema>;

const ReflectivePracticeForm = () => {
  const navigate = useNavigate();
  const [totalWords, setTotalWords] = useState(0);
  const maxWords = 2000;
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripNumber: '',
      callNarrative: '',
      whatHappened: '',
      whatWentWell: '',
      whatCanBeImproved: '',
      whatYouLearned: '',
      conclusion: '',
      studentSignature: '',
      ftpSignature: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedFields = watch([
    'callNarrative',
    'whatHappened',
    'whatWentWell',
    'whatCanBeImproved',
    'whatYouLearned',
    'conclusion',
  ]);

  React.useEffect(() => {
    const combinedText = watchedFields.join(' ');
    const wordCount = combinedText.trim() ? combinedText.trim().split(/\s+/).length : 0;
    setTotalWords(wordCount);
  }, [watchedFields]);

  const onSubmit = (data: FormValues) => {
    console.log('Form data submitted:', data);
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Submitting report...',
        success: () => {
          navigate('/dashboard');
          return 'Report submitted successfully!';
        },
        error: 'Failed to submit report',
      }
    );
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!');
  };

  return (
    <div className="pb-20">
      <Card>
        <CardHeader>
          <CardTitle>Reflective Practice Report</CardTitle>
          <CardDescription>
            Complete one detailed case report with structured reflection
          </CardDescription>
          <div className={`text-sm ${totalWords > maxWords ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
            Words: {totalWords}/{maxWords} {totalWords > maxWords && '(exceeded maximum)'}
          </div>
        </CardHeader>
        
        <CardContent>
          <form id="reflectiveForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tripNumber">Trip Number (CFS) <span className="text-red-500">*</span></Label>
              <Input
                id="tripNumber"
                {...register('tripNumber')}
                placeholder="Enter CFS number"
              />
              {errors.tripNumber && (
                <p className="text-red-500 text-sm">{errors.tripNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="callNarrative">Detailed Call Narrative <span className="text-red-500">*</span></Label>
              <Textarea
                id="callNarrative"
                {...register('callNarrative')}
                placeholder="Provide a detailed description of the call"
                className="min-h-[120px]"
              />
              {errors.callNarrative && (
                <p className="text-red-500 text-sm">{errors.callNarrative.message}</p>
              )}
            </div>
            
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-medium">Structured Reflection</h3>
              
              <div className="space-y-2">
                <Label htmlFor="whatHappened">What happened? <span className="text-red-500">*</span></Label>
                <Textarea
                  id="whatHappened"
                  {...register('whatHappened')}
                  placeholder="Describe what happened during the call"
                  className="min-h-[100px]"
                />
                {errors.whatHappened && (
                  <p className="text-red-500 text-sm">{errors.whatHappened.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatWentWell">What went well? <span className="text-red-500">*</span></Label>
                <Textarea
                  id="whatWentWell"
                  {...register('whatWentWell')}
                  placeholder="Describe aspects of the call that went well"
                  className="min-h-[100px]"
                />
                {errors.whatWentWell && (
                  <p className="text-red-500 text-sm">{errors.whatWentWell.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatCanBeImproved">What can be improved? <span className="text-red-500">*</span></Label>
                <Textarea
                  id="whatCanBeImproved"
                  {...register('whatCanBeImproved')}
                  placeholder="Describe aspects that could be improved"
                  className="min-h-[100px]"
                />
                {errors.whatCanBeImproved && (
                  <p className="text-red-500 text-sm">{errors.whatCanBeImproved.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatYouLearned">What you've learned from this case? <span className="text-red-500">*</span></Label>
                <Textarea
                  id="whatYouLearned"
                  {...register('whatYouLearned')}
                  placeholder="Describe key learnings from this case"
                  className="min-h-[100px]"
                />
                {errors.whatYouLearned && (
                  <p className="text-red-500 text-sm">{errors.whatYouLearned.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conclusion">Your conclusion about the case <span className="text-red-500">*</span></Label>
                <Textarea
                  id="conclusion"
                  {...register('conclusion')}
                  placeholder="Provide your overall conclusion"
                  className="min-h-[100px]"
                />
                {errors.conclusion && (
                  <p className="text-red-500 text-sm">{errors.conclusion.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-medium">Signatures</h3>
              
              <div className="space-y-4">
                <div>
                  <SignatureField
                    label="Student Signature *"
                    value={watch('studentSignature')}
                    onChange={(value) => setValue('studentSignature', value, { shouldDirty: true })}
                    error={errors.studentSignature?.message}
                    required
                  />
                </div>
                
                <div>
                  <SignatureField
                    label="FTP Review Signature"
                    value={watch('ftpSignature')}
                    onChange={(value) => setValue('ftpSignature', value, { shouldDirty: true })}
                    error={errors.ftpSignature?.message}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleSaveDraft}
            disabled={!isDirty || isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            type="submit"
            form="reflectiveForm"
            className="w-full sm:w-auto"
            disabled={isSubmitting || totalWords > maxWords}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReflectivePracticeForm;
