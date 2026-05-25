-- Create User Course Progress Table
CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    completed_modules INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- Array of completed module indices (e.g., [1, 2])
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can read own course progress" ON public.user_course_progress;
CREATE POLICY "Users can read own course progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own course progress" ON public.user_course_progress;
CREATE POLICY "Users can manage own course progress" ON public.user_course_progress FOR ALL USING (auth.uid() = user_id);
