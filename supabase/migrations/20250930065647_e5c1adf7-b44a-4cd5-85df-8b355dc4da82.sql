-- Fix security definer views by recreating them without security definer
-- Or if they need security definer, ensure they're properly secured

-- Fix existing functions that don't have search_path set
-- Update handle_new_user function to include search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update assign_user_role function to include search_path
CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update delete_user function to include search_path
CREATE OR REPLACE FUNCTION public.delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete will cascade to students/coordinators/submissions due to foreign keys
  DELETE FROM public.profiles WHERE id = user_id;
END;
$$;