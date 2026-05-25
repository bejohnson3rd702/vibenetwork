-- Create Available Slots Table
CREATE TABLE IF NOT EXISTS public.available_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date INTEGER NOT NULL, -- The day of the current month (e.g. 16, 18, 22)
    time TEXT NOT NULL,    -- The formatted time string (e.g. "10:00 AM")
    is_booked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, date, time)
);

-- Enable RLS
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public select available_slots" ON public.available_slots;
CREATE POLICY "Public select available_slots" ON public.available_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creators can manage own available_slots" ON public.available_slots;
CREATE POLICY "Creators can manage own available_slots" ON public.available_slots FOR ALL USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Anyone can book an available slot" ON public.available_slots;
CREATE POLICY "Anyone can book an available slot" ON public.available_slots FOR UPDATE USING (is_booked = false) WITH CHECK (is_booked = true);

