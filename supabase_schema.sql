-- Vibe Network Database Schema Migration

-- 1. Whitelabel Configs
CREATE TABLE IF NOT EXISTS public.whitelabel_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    logo TEXT,
    theme JSONB DEFAULT '{}'::jsonb,
    platform_fee_percentage NUMERIC DEFAULT 15.00,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure new columns are added if the table already exists
ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- 2. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    cover_image TEXT,
    homepage_image_url TEXT,
    flipbook_images TEXT,
    bio TEXT,
    sub_price NUMERIC DEFAULT 4.99,
    stripe_account_id TEXT,
    platform_fee_percentage NUMERIC DEFAULT 15.00,
    is_admin BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'viewer',
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure new columns are added if the table already exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Videos
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[],
    stream_time TEXT,
    price NUMERIC DEFAULT 0.00,
    preview_duration INTEGER DEFAULT 90,
    category_id UUID REFERENCES public.categories(id),
    creator_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure new columns are added if the table already exists
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS stream_time TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0.00;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS preview_duration INTEGER DEFAULT 90;

-- 5. Products (Store)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT,
    variants JSONB DEFAULT '{}'::jsonb,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Posts (Feed)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT false,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.whitelabel_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read Access)
DROP POLICY IF EXISTS "Allow public read access for whitelabel_configs" ON public.whitelabel_configs;
CREATE POLICY "Allow public read access for whitelabel_configs" ON public.whitelabel_configs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for profiles" ON public.profiles;
CREATE POLICY "Allow public read access for profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for categories" ON public.categories;
CREATE POLICY "Allow public read access for categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for videos" ON public.videos;
CREATE POLICY "Allow public read access for videos" ON public.videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for products" ON public.products;
CREATE POLICY "Allow public read access for products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for posts" ON public.posts;
CREATE POLICY "Allow public read access for posts" ON public.posts FOR SELECT USING (true);

-- Create Policies (Authenticated Insert/Update for own data)
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Allow users to insert own products" ON public.products;
CREATE POLICY "Allow users to insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to update own products" ON public.products;
CREATE POLICY "Allow users to update own products" ON public.products FOR UPDATE USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to insert own posts" ON public.posts;
CREATE POLICY "Allow users to insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to update own posts" ON public.posts;
CREATE POLICY "Allow users to update own posts" ON public.posts FOR UPDATE USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to delete own posts" ON public.posts;
CREATE POLICY "Allow users to delete own posts" ON public.posts FOR DELETE USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to delete own products" ON public.products;
CREATE POLICY "Allow users to delete own products" ON public.products FOR DELETE USING (auth.uid() = creator_id);

-- Optional: Allow permissive insert for testing phase (Uncomment if needed)
DROP POLICY IF EXISTS "Testing Insert All" ON public.products;
CREATE POLICY "Testing Insert All" ON public.products FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Testing Insert All" ON public.posts;
CREATE POLICY "Testing Insert All" ON public.posts FOR INSERT WITH CHECK (true);

-- Admin Global Access Bypasses (Requires is_admin = true on the user's profile)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
CREATE POLICY "Admins can insert videos" ON public.videos FOR INSERT WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
DROP POLICY IF EXISTS "Admins can insert whitelabel configs" ON public.whitelabel_configs;
CREATE POLICY "Admins can insert whitelabel configs" ON public.whitelabel_configs FOR INSERT WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
DROP POLICY IF EXISTS "Admins can update whitelabel configs" ON public.whitelabel_configs;
CREATE POLICY "Admins can update whitelabel configs" ON public.whitelabel_configs FOR UPDATE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

DROP POLICY IF EXISTS "Users can insert their own whitelabel config" ON public.whitelabel_configs;
CREATE POLICY "Users can insert their own whitelabel config" ON public.whitelabel_configs FOR INSERT WITH CHECK (
    auth.uid() = owner_id
);

DROP POLICY IF EXISTS "Users can update their own whitelabel config" ON public.whitelabel_configs;
CREATE POLICY "Users can update their own whitelabel config" ON public.whitelabel_configs FOR UPDATE USING (
    auth.uid() = owner_id
);

-- 7. Series
CREATE TABLE IF NOT EXISTS public.series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    img TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Episodes
CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    length TEXT,
    price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    price NUMERIC NOT NULL,
    meeting_type TEXT DEFAULT 'virtual_video',
    meeting_link TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 10. Courses
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price NUMERIC DEFAULT 0.00,
    modules INTEGER DEFAULT 10,
    hours TEXT,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 11. Ledger (Global Accounting)
CREATE TABLE IF NOT EXISTS public.ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC NOT NULL,
    buyer_id UUID REFERENCES auth.users(id),
    creator_id UUID REFERENCES public.profiles(id),
    product_title TEXT,
    transaction_type TEXT DEFAULT 'PPV',
    stripe_payment_intent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to view own ledger" ON public.ledger;
CREATE POLICY "Allow users to view own ledger" ON public.ledger FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = creator_id);
DROP POLICY IF EXISTS "Admins can view global ledger" ON public.ledger;
CREATE POLICY "Admins can view global ledger" ON public.ledger FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
-- Insert via webhook only (Service Role Key bypasses RLS)

DROP POLICY IF EXISTS "Allow public read access for series" ON public.series;
CREATE POLICY "Allow public read access for series" ON public.series FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for episodes" ON public.episodes;
CREATE POLICY "Allow public read access for episodes" ON public.episodes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access for bookings" ON public.bookings;
CREATE POLICY "Allow public read access for bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to insert own series" ON public.series;
CREATE POLICY "Allow users to insert own series" ON public.series FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to update own series" ON public.series;
CREATE POLICY "Allow users to update own series" ON public.series FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Allow users to insert own bookings" ON public.bookings;
CREATE POLICY "Allow users to insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to update own bookings" ON public.bookings;
CREATE POLICY "Allow users to update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Allow public read access for courses" ON public.courses;
CREATE POLICY "Allow public read access for courses" ON public.courses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow users to insert own courses" ON public.courses;
CREATE POLICY "Allow users to insert own courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "Allow users to update own courses" ON public.courses;
CREATE POLICY "Allow users to update own courses" ON public.courses FOR UPDATE USING (auth.uid() = creator_id);

-- 12. Storage Buckets (For avatars, covers, and thumbnails)
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS platform_fee_percentage NUMERIC DEFAULT 15.00;
ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS platform_fee_percentage NUMERIC DEFAULT 15.00;

-- Global Settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    global_vibe_fee NUMERIC DEFAULT 15.00,
    global_whitelabel_fee NUMERIC DEFAULT 15.00,
    global_vibe_fee_whitelabel NUMERIC DEFAULT 15.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for platform_settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update platform_settings" ON public.platform_settings FOR UPDATE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can insert platform_settings" ON public.platform_settings FOR INSERT WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- System Logs for Admin Audit Trail
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT DEFAULT 'INFO', -- INFO, WARN, ERROR, SUCCESS, ALERT
    message TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read system logs" ON public.system_logs FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Anyone can insert logs" ON public.system_logs FOR INSERT WITH CHECK (true);

-- Missing Tables for Creator Studio
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    price NUMERIC NOT NULL,
    duration INTEGER NOT NULL,
    booking_type TEXT,
    call_type TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = buyer_id);
CREATE POLICY "Users can insert bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    type TEXT DEFAULT 'digital',
    image_url TEXT,
    variants JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Creators can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    modules INTEGER DEFAULT 1,
    hours NUMERIC DEFAULT 1.0,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Creators can insert courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS public.series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read series" ON public.series FOR SELECT USING (true);
CREATE POLICY "Creators can insert series" ON public.series FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE TABLE IF NOT EXISTS public.episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    length TEXT,
    price NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Creators can insert episodes" ON public.episodes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.series WHERE id = series_id AND creator_id = auth.uid())
);
