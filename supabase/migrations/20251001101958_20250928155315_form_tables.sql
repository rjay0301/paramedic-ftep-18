CREATE TABLE IF NOT EXISTS public.addendum_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,
  content JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT addendum_forms_student_form_unique UNIQUE (student_id, form_type)
);

ALTER TABLE public.addendum_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their addendum forms" 
ON public.addendum_forms 
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = addendum_forms.student_id));

CREATE POLICY "Students can insert their addendum forms" 
ON public.addendum_forms 
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (SELECT profile_id FROM students WHERE id = addendum_forms.student_id));

CREATE POLICY "Students can update their addendum forms" 
ON public.addendum_forms 
FOR UPDATE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = addendum_forms.student_id));

CREATE POLICY "Students can delete their addendum forms" 
ON public.addendum_forms 
FOR DELETE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = addendum_forms.student_id));

CREATE TABLE IF NOT EXISTS public.form_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,
  form_identifier TEXT NOT NULL,
  form_data JSONB,
  last_saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT form_drafts_unique UNIQUE (student_id, form_type, form_identifier)
);

ALTER TABLE public.form_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their form drafts" 
ON public.form_drafts 
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_drafts.student_id));

CREATE POLICY "Students can insert their form drafts" 
ON public.form_drafts 
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_drafts.student_id));

CREATE POLICY "Students can update their form drafts" 
ON public.form_drafts 
FOR UPDATE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_drafts.student_id));

CREATE POLICY "Students can delete their form drafts" 
ON public.form_drafts 
FOR DELETE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_drafts.student_id));

CREATE TABLE IF NOT EXISTS public.instructional_case_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
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

ALTER TABLE public.instructional_case_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their case summaries" 
ON public.instructional_case_summaries 
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = instructional_case_summaries.student_id));

CREATE POLICY "Students can insert their case summaries" 
ON public.instructional_case_summaries 
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (SELECT profile_id FROM students WHERE id = instructional_case_summaries.student_id));

CREATE POLICY "Students can update their case summaries" 
ON public.instructional_case_summaries 
FOR UPDATE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = instructional_case_summaries.student_id));

CREATE POLICY "Students can delete their case summaries" 
ON public.instructional_case_summaries 
FOR DELETE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = instructional_case_summaries.student_id));

CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
  completed_forms INTEGER NOT NULL DEFAULT 0,
  total_forms INTEGER NOT NULL DEFAULT 74,
  percentage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their progress" 
ON public.student_progress 
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = student_progress.student_id));

CREATE POLICY "Coordinators can view all student progress" 
ON public.student_progress 
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'coordinator'
));

CREATE POLICY "Admins can view all student progress" 
ON public.student_progress 
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));