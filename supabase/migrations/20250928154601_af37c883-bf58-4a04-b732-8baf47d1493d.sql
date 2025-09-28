-- Add missing columns to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS alpha_unit_text TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS hub_id UUID;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS hub_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS ftp_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS ftp_contact TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- Create hubs table
CREATE TABLE IF NOT EXISTS public.hubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on hubs
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;

-- Create policy for hubs (anyone can view)
CREATE POLICY "Anyone can view hubs" 
ON public.hubs 
FOR SELECT 
USING (true);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  form_id UUID NOT NULL,
  form_type TEXT NOT NULL,
  form_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT form_submissions_student_form_unique UNIQUE (student_id, form_type, form_number)
);

-- Enable RLS on form_submissions
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for form_submissions
CREATE POLICY "Students can manage their form submissions" 
ON public.form_submissions 
FOR ALL 
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_submissions.student_id));

-- Create form_revisions table
CREATE TABLE IF NOT EXISTS public.form_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_submission_id UUID NOT NULL REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS on form_revisions
ALTER TABLE public.form_revisions ENABLE ROW LEVEL SECURITY;

-- Create policies for form_revisions
CREATE POLICY "Users can manage form revisions for their submissions" 
ON public.form_revisions 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT students.profile_id 
    FROM students 
    JOIN form_submissions ON students.id = form_submissions.student_id 
    WHERE form_submissions.id = form_revisions.form_submission_id
  )
);