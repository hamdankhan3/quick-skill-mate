
DROP POLICY IF EXISTS "Auth users can read profiles for display" ON public.profiles;

CREATE OR REPLACE FUNCTION public.shares_job_with(_viewer uuid, _other uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE (j.customer_id = _viewer AND j.accepted_worker_id = _other)
       OR (j.accepted_worker_id = _viewer AND j.customer_id = _other)
  ) OR EXISTS (
    SELECT 1 FROM public.offers o
    JOIN public.jobs j ON j.id = o.job_id
    WHERE (o.worker_id = _viewer AND j.customer_id = _other)
       OR (j.customer_id = _viewer AND o.worker_id = _other)
  )
$$;

CREATE POLICY "Users can read profiles of job participants"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.shares_job_with(auth.uid(), user_id));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated, anon
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
