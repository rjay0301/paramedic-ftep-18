-- Fix the security definer views by recreating them as regular views
DROP VIEW IF EXISTS public.student_overall_progress;
DROP VIEW IF EXISTS public.admin_user_view;

-- Recreate student_overall_progress as a regular view (not security definer)
CREATE VIEW public.student_overall_progress AS
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

-- Recreate admin_user_view as a regular view (not security definer)
CREATE VIEW public.admin_user_view AS
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