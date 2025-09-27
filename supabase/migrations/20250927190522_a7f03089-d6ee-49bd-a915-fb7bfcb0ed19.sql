-- Add missing tables, views and functions

-- Create audit_logs table
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

-- Enable RLS for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit_logs (only admins can view)
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  assignment_number INTEGER NOT NULL,
  content JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, assignment_number)
);

-- Enable RLS for assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create policy for assignments (students can manage their own)
CREATE POLICY "Students can manage their assignments" 
ON public.assignments 
FOR ALL 
USING (auth.uid() IN (
  SELECT profile_id FROM public.students WHERE students.id = assignments.student_id
));

-- Update student_overall_progress view to include completed_phases and total_phases
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

-- Create student_phase_progress view
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

-- Create function to get all tables
CREATE OR REPLACE FUNCTION public.get_all_tables()
RETURNS TABLE(
  name TEXT,
  schema TEXT,
  record_count BIGINT,
  comment TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::TEXT as name,
    t.table_schema::TEXT as schema,
    0::BIGINT as record_count,
    ''::TEXT as comment
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE';
END;
$$;

-- Create function to get table columns
CREATE OR REPLACE FUNCTION public.get_table_columns(p_schema_name TEXT, p_table_name TEXT)
RETURNS TABLE(
  name TEXT,
  type TEXT,
  is_nullable BOOLEAN,
  is_primary_key BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT as name,
    c.data_type::TEXT as type,
    CASE WHEN c.is_nullable = 'YES' THEN true ELSE false END as is_nullable,
    CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN true ELSE false END as is_primary_key
  FROM information_schema.columns c
  LEFT JOIN information_schema.key_column_usage kcu 
    ON c.table_schema = kcu.table_schema 
    AND c.table_name = kcu.table_name 
    AND c.column_name = kcu.column_name
  LEFT JOIN information_schema.table_constraints tc 
    ON kcu.constraint_name = tc.constraint_name 
    AND kcu.table_schema = tc.table_schema
  WHERE c.table_schema = p_schema_name 
  AND c.table_name = p_table_name
  ORDER BY c.ordinal_position;
END;
$$;

-- Create function to recalculate student progress
CREATE OR REPLACE FUNCTION public.recalculate_student_progress(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function would normally recalculate progress
  -- For now, it just returns true as progress is calculated via views
  RETURN TRUE;
END;
$$;