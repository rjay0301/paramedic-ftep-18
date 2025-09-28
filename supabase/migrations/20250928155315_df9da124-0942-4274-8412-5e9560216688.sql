-- Create missing tables that the code expects

-- Create addendum_forms table
CREATE TABLE IF NOT EXISTS public.addendum_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  form_type TEXT NOT NULL,
  content JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT addendum_forms_student_form_unique UNIQUE (student_id, form_type)
);

-- Enable RLS on addendum_forms
ALTER TABLE public.addendum_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for addendum_forms
CREATE POLICY "Students can manage their addendum forms" 
ON public.addendum_forms 
FOR ALL 
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = addendum_forms.student_id));

-- Create form_drafts table
CREATE TABLE IF NOT EXISTS public.form_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  form_type TEXT NOT NULL,
  form_identifier TEXT NOT NULL,
  form_data JSONB,
  last_saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT form_drafts_unique UNIQUE (student_id, form_type, form_identifier)
);

-- Enable RLS on form_drafts
ALTER TABLE public.form_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies for form_drafts
CREATE POLICY "Students can manage their form drafts" 
ON public.form_drafts 
FOR ALL 
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_drafts.student_id));

-- Create instructional_case_summaries table
CREATE TABLE IF NOT EXISTS public.instructional_case_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  summary_number INTEGER NOT NULL,
  cfs_number TEXT,
  date DATE,
  chief_complaint TEXT,
  priority TEXT DEFAULT 'P1',
  clinical_performance JSONB,
  skills_performed TEXT,
  medications_administered TEXT,
  performed_well TEXT,
  areas_to_improve TEXT,
  ftp_feedback TEXT,
  student_signature TEXT,
  ftp_signature TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT instructional_case_summaries_unique UNIQUE (student_id, summary_number)
);

-- Enable RLS on instructional_case_summaries
ALTER TABLE public.instructional_case_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for instructional_case_summaries
CREATE POLICY "Students can manage their case summaries" 
ON public.instructional_case_summaries 
FOR ALL 
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = instructional_case_summaries.student_id));

-- Create student_progress table (separate from the view)
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL UNIQUE,
  completed_forms INTEGER NOT NULL DEFAULT 0,
  total_forms INTEGER NOT NULL DEFAULT 74,
  percentage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_progress
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for student_progress
CREATE POLICY "Students can view their progress" 
ON public.student_progress 
FOR SELECT 
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = student_progress.student_id));

CREATE POLICY "System can manage student progress" 
ON public.student_progress 
FOR ALL 
USING (true);

-- Add foreign key relationships where appropriate
ALTER TABLE public.addendum_forms 
ADD CONSTRAINT addendum_forms_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE public.form_drafts 
ADD CONSTRAINT form_drafts_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE public.instructional_case_summaries 
ADD CONSTRAINT instructional_case_summaries_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE public.student_progress 
ADD CONSTRAINT student_progress_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;