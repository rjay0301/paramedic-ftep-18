-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'coordinator', 'admin')),
  full_name TEXT,
  email TEXT,
  corp_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive')),
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create coordinators table
CREATE TABLE public.coordinators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- Enable RLS on coordinators
ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;

-- Create training_phases table
CREATE TABLE public.training_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on training_phases
ALTER TABLE public.training_phases ENABLE ROW LEVEL SECURITY;

-- Create student_submissions table
CREATE TABLE public.student_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  phase_id UUID NOT NULL REFERENCES public.training_phases(id) ON DELETE CASCADE,
  form_data JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_submissions
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- Create student_overall_progress view
CREATE OR REPLACE VIEW public.student_overall_progress AS
SELECT 
  s.id as student_id,
  s.profile_id,
  s.full_name,
  COALESCE(ROUND((COUNT(CASE WHEN ss.status = 'approved' THEN 1 END)::numeric / NULLIF(COUNT(tp.id), 0)) * 100, 2), 0) as overall_percentage,
  COUNT(CASE WHEN ss.status = 'approved' THEN 1 END) as completed_forms,
  COUNT(tp.id) as total_forms
FROM public.students s
CROSS JOIN public.training_phases tp
LEFT JOIN public.student_submissions ss ON s.id = ss.student_id AND tp.id = ss.phase_id
GROUP BY s.id, s.profile_id, s.full_name;

-- Create admin_user_view
CREATE OR REPLACE VIEW public.admin_user_view AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.created_at,
  COALESCE(s.status, c.status, p.status) as status,
  CASE 
    WHEN p.role = 'student' THEN 'student'
    WHEN p.role = 'coordinator' THEN 'coordinator'
    ELSE 'profile'
  END as record_type
FROM public.profiles p
LEFT JOIN public.students s ON p.id = s.profile_id
LEFT JOIN public.coordinators c ON p.id = c.profile_id;

-- Create basic RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view their student record" ON public.students
  FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can view their coordinator record" ON public.coordinators
  FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Anyone can view training phases" ON public.training_phases
  FOR SELECT USING (true);

CREATE POLICY "Students can manage their submissions" ON public.student_submissions
  FOR ALL USING (auth.uid() IN (SELECT profile_id FROM students WHERE id = student_id));

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to assign user roles
CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Update the profile role
  UPDATE public.profiles 
  SET role = p_role, updated_at = now()
  WHERE id = p_user_id;
  
  -- Create role-specific record
  IF p_role = 'student' THEN
    INSERT INTO public.students (profile_id, full_name, email)
    SELECT p_user_id, full_name, email FROM public.profiles WHERE id = p_user_id
    ON CONFLICT (profile_id) DO NOTHING;
  ELSIF p_role = 'coordinator' THEN
    INSERT INTO public.coordinators (profile_id)
    VALUES (p_user_id)
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Create function to delete user and all related data
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Delete will cascade to students/coordinators/submissions due to foreign keys
  DELETE FROM public.profiles WHERE id = user_id;
END;
$$;

-- Insert some basic training phases
INSERT INTO public.training_phases (name, description, order_index) VALUES
('Observational Phase', 'Initial observation and learning phase', 1),
('Instructional Phase', 'Hands-on instruction and practice', 2),
('Independent Phase', 'Independent practice and evaluation', 3),
('Final Evaluation', 'Comprehensive final assessment', 4)
ON CONFLICT DO NOTHING;