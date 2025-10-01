-- Add missing columns to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS alpha_unit_text TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS hub_id UUID;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS hub_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS ftp_name TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS ftp_contact TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

CREATE TABLE IF NOT EXISTS public.hubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hubs" 
ON public.hubs 
FOR SELECT TO authenticated
USING (true);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assignment_number INTEGER NOT NULL,
  content JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, assignment_number)
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their assignments" 
ON public.assignments 
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT profile_id FROM public.students WHERE students.id = assignments.student_id
));

CREATE POLICY "Students can insert their assignments" 
ON public.assignments 
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT profile_id FROM public.students WHERE students.id = assignments.student_id
));

CREATE POLICY "Students can update their assignments" 
ON public.assignments 
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT profile_id FROM public.students WHERE students.id = assignments.student_id
));

CREATE POLICY "Students can delete their assignments" 
ON public.assignments 
FOR DELETE TO authenticated
USING (auth.uid() IN (
  SELECT profile_id FROM public.students WHERE students.id = assignments.student_id
));

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  form_id UUID NOT NULL,
  form_type TEXT NOT NULL,
  form_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT form_submissions_student_form_unique UNIQUE (student_id, form_type, form_number)
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their form submissions" 
ON public.form_submissions 
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_submissions.student_id));

CREATE POLICY "Students can insert their form submissions" 
ON public.form_submissions 
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_submissions.student_id));

CREATE POLICY "Students can update their form submissions" 
ON public.form_submissions 
FOR UPDATE TO authenticated
USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = form_submissions.student_id));

CREATE TABLE IF NOT EXISTS public.form_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_submission_id UUID NOT NULL REFERENCES public.form_submissions(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.form_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view form revisions for their submissions" 
ON public.form_revisions 
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT students.profile_id 
    FROM students 
    JOIN form_submissions ON students.id = form_submissions.student_id 
    WHERE form_submissions.id = form_revisions.form_submission_id
  )
);

CREATE POLICY "Students can insert form revisions for their submissions" 
ON public.form_revisions 
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT students.profile_id 
    FROM students 
    JOIN form_submissions ON students.id = form_submissions.student_id 
    WHERE form_submissions.id = form_revisions.form_submission_id
  )
);

DROP VIEW IF EXISTS public.student_overall_progress;
CREATE VIEW public.student_overall_progress AS
SELECT 
  s.id as student_id,
  s.profile_id,
  s.full_name,
  COALESCE(ROUND((COUNT(CASE WHEN ss.status = 'approved' THEN 1 END)::numeric / NULLIF(COUNT(tp.id), 0)) * 100, 2), 0) as overall_percentage,
  COUNT(CASE WHEN ss.status = 'approved' THEN 1 END) as completed_forms,
  COUNT(tp.id) as total_forms,
  COUNT(DISTINCT CASE WHEN ss.status = 'approved' THEN tp.id END) as completed_phases,
  COUNT(DISTINCT tp.id) as total_phases
FROM public.students s
CROSS JOIN public.training_phases tp
LEFT JOIN public.student_submissions ss ON s.id = ss.student_id AND tp.id = ss.phase_id
GROUP BY s.id, s.profile_id, s.full_name;

CREATE OR REPLACE VIEW public.student_phase_progress AS
SELECT 
  s.id as student_id,
  tp.id as phase_id,
  tp.name as phase_name,
  COUNT(CASE WHEN ss.status = 'approved' THEN 1 END) as completed_items,
  COUNT(tp.id) as total_items,
  COUNT(CASE WHEN ss.status = 'approved' THEN 1 END) = COUNT(tp.id) as is_complete,
  COALESCE(ROUND((COUNT(CASE WHEN ss.status = 'approved' THEN 1 END)::numeric / NULLIF(COUNT(tp.id), 0)) * 100, 2), 0) as completion_percentage
FROM public.students s
CROSS JOIN public.training_phases tp
LEFT JOIN public.student_submissions ss ON s.id = ss.student_id AND tp.id = ss.phase_id
GROUP BY s.id, tp.id, tp.name;

CREATE OR REPLACE FUNCTION public.recalculate_student_progress(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN TRUE;
END;
$$;