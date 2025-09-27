import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Send, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

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
import { Button } from '@/components/ui/button';
import SignatureField from '@/components/common/SignatureField';

const formSchema = z.object({
  // FTP Declaration
  ftpName: z.string().min(1, 'FTP Name is required'),
  ftpStaffNumber: z.string().min(1, 'FTP Staff Number is required'),
  studentName: z.string().min(1, 'Student Name is required'),
  studentStaffNumber: z.string().min(1, 'Student Staff Number is required'),
  ftpSignature: z.string().min(1, 'FTP Signature is required'),
  ftpDate: z.string().min(1, 'Date is required'),
  
  // Student Declaration
  studentDeclarationName: z.string().min(1, 'Student Name is required'),
  studentDeclarationNumber: z.string().min(1, 'Student Number is required'),
  studentDeclarationSignature: z.string().min(1, 'Student Signature is required'),
  studentDeclarationDate: z.string().min(1, 'Date is required'),
});

type FormValues = z.infer<typeof formSchema>;

const DeclarationForm = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ftpName: '',
      ftpStaffNumber: '',
      studentName: '',
      studentStaffNumber: '',
      ftpSignature: '',
      ftpDate: new Date().toISOString().split('T')[0],
      
      studentDeclarationName: '',
      studentDeclarationNumber: '',
      studentDeclarationSignature: '',
      studentDeclarationDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form data submitted:', data);
    
    // Simulate API submission
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Submitting declaration...',
        success: () => {
          navigate('/dashboard');
          return 'Declaration submitted successfully!';
        },
        error: 'Failed to submit declaration',
      }
    );
  };

  const handleSaveDraft = () => {
    // Simulate saving draft
    toast.success('Draft saved successfully!');
  };

  // Render input field with label for mobile
  const renderMobileInput = (id: string, label: string, registerKey: keyof FormValues) => (
    <div className="mb-4">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </Label>
      <Input
        id={id}
        type="text"
        className="w-full"
        placeholder={label}
        {...register(registerKey)}
      />
      {errors[registerKey] && (
        <p className="text-red-500 text-sm mt-1">{errors[registerKey]?.message}</p>
      )}
    </div>
  );

  // Desktop inline input field
  const renderDesktopInput = (label: string, registerKey: keyof FormValues) => (
    <span className="relative inline-block mx-1">
      <Input
        type="text"
        className="border border-gray-300 px-2 py-1 w-[120px] h-8 text-sm"
        placeholder={label}
        {...register(registerKey)}
      />
      {errors[registerKey] && (
        <p className="text-red-500 text-xs absolute -bottom-5 left-0 whitespace-nowrap">
          {errors[registerKey]?.message}
        </p>
      )}
    </span>
  );

  return (
    <div className="pb-20">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Declaration of Readiness
          </CardTitle>
          <CardDescription>
            Complete the declaration forms to confirm readiness for final evaluation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="declarationForm" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* FTP Declaration Section */}
            <div className="space-y-6 p-4 md:p-6 border rounded-md bg-gray-50">
              <h3 className="text-lg font-medium border-b pb-2">FTP Declaration</h3>
              
              {isMobile ? (
                <div className="space-y-4">
                  {renderMobileInput("ftpName", "FTP Name", "ftpName")}
                  {renderMobileInput("ftpStaffNumber", "FTP Staff Number", "ftpStaffNumber")}
                  {renderMobileInput("studentName", "Student Name", "studentName")}
                  {renderMobileInput("studentStaffNumber", "Student Staff Number", "studentStaffNumber")}
                  
                  <p className="text-sm text-gray-700 mt-2">
                    I confirm that my student has successfully completed his Field Training and Evaluation Program Workbook, 
                    and is now at a level of competency to be assessed for independent practice by an FTP Evaluator.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      I, {renderDesktopInput("FTP Name", "ftpName")}, 
                      staff number {renderDesktopInput("FTP Staff Number", "ftpStaffNumber")}, 
                      confirms that my student {renderDesktopInput("Student Name", "studentName")}, 
                      staff number {renderDesktopInput("Student Staff Number", "studentStaffNumber")}, 
                      has successfully completed his Field Training and Evaluation Program Workbook, 
                      and is now at a level of competency to be assessed for independent practice by an FTP Evaluator.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 mt-8">
                <div>
                  <SignatureField
                    label="FTP Signature *"
                    value={watch('ftpSignature')}
                    onChange={(value) => setValue('ftpSignature', value, { shouldDirty: true })}
                    error={errors.ftpSignature?.message}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="ftpDate">Date *</Label>
                  <Input
                    id="ftpDate"
                    type="date"
                    {...register('ftpDate')}
                    className="mt-1"
                  />
                  {errors.ftpDate && (
                    <p className="text-red-500 text-sm">{errors.ftpDate.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Student Declaration Section */}
            <div className="space-y-6 p-4 md:p-6 border rounded-md bg-gray-50">
              <h3 className="text-lg font-medium border-b pb-2">Student Declaration</h3>
              
              {isMobile ? (
                <div className="space-y-4">
                  {renderMobileInput("studentDeclarationName", "Student Name", "studentDeclarationName")}
                  {renderMobileInput("studentDeclarationNumber", "Student Number", "studentDeclarationNumber")}
                  
                  <p className="text-sm text-gray-700 mt-2">
                    I confirm that I have completed all documentation and assignments related to the Field Training 
                    and Evaluation Program to the best of my ability and through my own efforts. I understand that 
                    if it is found I have copied or reproduced the work of others in the completion of this workbook 
                    that I may be subject to discipline and/or be required to repeat the FTE Program. I feel that I am 
                    sufficiently prepared for final field evaluation and unsupervised practice as an Ambulance Paramedic.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="mb-6">
                      I, {renderDesktopInput("Student Name", "studentDeclarationName")}, 
                      staff number {renderDesktopInput("Student Number", "studentDeclarationNumber")}, 
                      confirm that I have completed all documentation and assignments related to the Field Training 
                      and Evaluation Program to the best of my ability and through my own efforts. I understand that 
                      if it is found I have copied or reproduced the work of others in the completion of this workbook 
                      that I may be subject to discipline and/or be required to repeat the FTE Program. I feel that I am 
                      sufficiently prepared for final field evaluation and unsupervised practice as an Ambulance Paramedic.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 mt-8">
                <div>
                  <SignatureField
                    label="Student Signature *"
                    value={watch('studentDeclarationSignature')}
                    onChange={(value) => setValue('studentDeclarationSignature', value, { shouldDirty: true })}
                    error={errors.studentDeclarationSignature?.message}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="studentDeclarationDate">Date *</Label>
                  <Input
                    id="studentDeclarationDate"
                    type="date"
                    {...register('studentDeclarationDate')}
                    className="mt-1"
                  />
                  {errors.studentDeclarationDate && (
                    <p className="text-red-500 text-sm">{errors.studentDeclarationDate.message}</p>
                  )}
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
            form="declarationForm"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Declaration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeclarationForm;
