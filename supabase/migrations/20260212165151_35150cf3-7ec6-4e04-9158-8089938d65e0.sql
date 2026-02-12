
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'worker', 'admin');

-- 2. Create job status enum
CREATE TYPE public.job_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- 3. Create offer status enum
CREATE TYPE public.offer_status AS ENUM ('pending', 'accepted', 'rejected', 'countered');

-- 4. Create service category enum
CREATE TYPE public.service_category AS ENUM ('electrician', 'plumber', 'mechanic', 'ac_technician', 'painter', 'cleaner', 'handyman', 'construction');

-- 5. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- 7. Worker profiles
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  hourly_rate_min NUMERIC(10,2),
  hourly_rate_max NUMERIC(10,2),
  categories service_category[] DEFAULT '{}',
  bio TEXT,
  completed_jobs_count INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category service_category NOT NULL,
  location TEXT NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('hourly', 'fixed', 'project')),
  offered_price NUMERIC(10,2) NOT NULL,
  preferred_time TIMESTAMPTZ,
  status job_status NOT NULL DEFAULT 'pending',
  accepted_worker_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 9. Offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_price NUMERIC(10,2) NOT NULL,
  message TEXT,
  status offer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, worker_id)
);

-- 10. Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, customer_id)
);

-- 12. Commission logs
CREATE TABLE public.commission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  worker_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_logs ENABLE ROW LEVEL SECURITY;

-- 14. Security definer helper functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- 15. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON public.worker_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 16. Auto-create profile and role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'customer'));

  -- If worker, create worker profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'worker' THEN
    INSERT INTO public.worker_profiles (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. RLS Policies

-- Profiles: users see own, admins see all, public read for basic info
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth users can read profiles for display" ON public.profiles FOR SELECT TO authenticated USING (true);

-- User roles: own read, admin manage
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Worker profiles: public read, own update
CREATE POLICY "Anyone can view worker profiles" ON public.worker_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Workers can update own profile" ON public.worker_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Workers can insert own profile" ON public.worker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs: authenticated can read pending, own read all, admin read all
CREATE POLICY "Authenticated users can read pending jobs" ON public.jobs FOR SELECT TO authenticated USING (status = 'pending');
CREATE POLICY "Customers can read own jobs" ON public.jobs FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Workers can read accepted jobs" ON public.jobs FOR SELECT USING (auth.uid() = accepted_worker_id);
CREATE POLICY "Admins can read all jobs" ON public.jobs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = customer_id AND public.has_role(auth.uid(), 'customer'));
CREATE POLICY "Job participants can update jobs" ON public.jobs FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = accepted_worker_id);
CREATE POLICY "Admins can update jobs" ON public.jobs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Offers
CREATE POLICY "Workers can create offers" ON public.offers FOR INSERT WITH CHECK (auth.uid() = worker_id AND public.has_role(auth.uid(), 'worker'));
CREATE POLICY "Workers can view own offers" ON public.offers FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Customers can view offers on their jobs" ON public.offers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = offers.job_id AND jobs.customer_id = auth.uid())
);
CREATE POLICY "Admins can view all offers" ON public.offers FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Offer participants can update" ON public.offers FOR UPDATE USING (
  auth.uid() = worker_id OR EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = offers.job_id AND jobs.customer_id = auth.uid())
);

-- Messages
CREATE POLICY "Job participants can read messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = messages.job_id AND (jobs.customer_id = auth.uid() OR jobs.accepted_worker_id = auth.uid()))
);
CREATE POLICY "Job participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = messages.job_id AND (jobs.customer_id = auth.uid() OR jobs.accepted_worker_id = auth.uid()))
);
CREATE POLICY "Admins can read all messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE POLICY "Anyone authenticated can read reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Customers can create reviews on completed jobs" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = customer_id AND
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = reviews.job_id AND jobs.customer_id = auth.uid() AND jobs.status = 'completed')
);

-- Commission logs: admin only
CREATE POLICY "Admins can read commission logs" ON public.commission_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert commission logs" ON public.commission_logs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 18. Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
