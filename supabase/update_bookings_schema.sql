-- Migration Script: Booking Availability, SMS Notifications & Call Recording

-- 1. Create available_slots table if it doesn't exist
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

-- Policies for available_slots
DROP POLICY IF EXISTS "Public select available_slots" ON public.available_slots;
CREATE POLICY "Public select available_slots" ON public.available_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creators can manage own available_slots" ON public.available_slots;
CREATE POLICY "Creators can manage own available_slots" ON public.available_slots FOR ALL USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Anyone can book an available slot" ON public.available_slots;
CREATE POLICY "Anyone can book an available slot" ON public.available_slots FOR UPDATE USING (is_booked = false) WITH CHECK (is_booked = true);

-- 2. Add new columns to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS meeting_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS meeting_purpose TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS record_call BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS recording_price NUMERIC DEFAULT 0.00;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- 3. Add new columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS booking_price NUMERIC DEFAULT 49.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS booking_availability JSONB DEFAULT '{"Mon": {"start": "09:00", "end": "17:00", "active": true}, "Tue": {"start": "09:00", "end": "17:00", "active": true}, "Wed": {"start": "09:00", "end": "17:00", "active": true}, "Thu": {"start": "09:00", "end": "17:00", "active": true}, "Fri": {"start": "09:00", "end": "17:00", "active": true}, "Sat": {"start": "09:00", "end": "17:00", "active": false}, "Sun": {"start": "09:00", "end": "17:00", "active": false}, "duration": 60}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sms_phone TEXT;

-- 4. Setup call-recordings storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('call-recordings', 'call-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('images', 'videos', 'call-recordings'));

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('images', 'videos', 'call-recordings') AND auth.role() = 'authenticated');
