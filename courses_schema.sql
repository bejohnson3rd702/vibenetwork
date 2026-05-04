-- 10. Courses (Masterclasses)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    modules INTEGER DEFAULT 0,
    hours TEXT,
    img TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow users to insert own courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow users to update own courses" ON public.courses FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Allow users to delete own courses" ON public.courses FOR DELETE USING (auth.uid() = creator_id);
