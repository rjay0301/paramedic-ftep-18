DROP VIEW IF EXISTS admin_user_view;

CREATE VIEW admin_user_view 
WITH (security_invoker = on)
AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.created_at,
  COALESCE(s.status, c.status, 'active') as status,
  CASE 
    WHEN s.id IS NOT NULL THEN 'student'
    WHEN c.id IS NOT NULL THEN 'coordinator'
    ELSE 'profile'
  END as record_type
FROM profiles p
LEFT JOIN students s ON p.id = s.profile_id
LEFT JOIN coordinators c ON p.id = c.profile_id
WHERE EXISTS (
  SELECT 1 FROM profiles admin_check 
  WHERE admin_check.id = auth.uid() 
  AND admin_check.role = 'admin'
);