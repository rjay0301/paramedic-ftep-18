-- Update the admin user's status from pending to active
UPDATE profiles 
SET status = 'active', updated_at = now()
WHERE email = 'rjay_0301@yahoo.com' AND role = 'admin';