-- Vibe Network Database Schema Migration

-- 1. Whitelabel Configs
CREATE TABLE IF NOT EXISTS public.whitelabel_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    logo TEXT,
    theme JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    category_id UUID REFERENCES public.categories(id),
    creator_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Products (Store)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT,
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
CREATE POLICY "Allow public read access for whitelabel_configs" ON public.whitelabel_configs FOR SELECT USING (true);
CREATE POLICY "Allow public read access for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access for videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access for posts" ON public.posts FOR SELECT USING (true);

-- Create Policies (Authenticated Insert/Update for own data)
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow users to update own products" ON public.products FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Allow users to insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow users to update own posts" ON public.posts FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Allow users to delete own posts" ON public.posts FOR DELETE USING (auth.uid() = creator_id);
CREATE POLICY "Allow users to delete own products" ON public.products FOR DELETE USING (auth.uid() = creator_id);

-- Optional: Allow permissive insert for testing phase (Uncomment if needed)
-- CREATE POLICY "Testing Insert All" ON public.products FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Testing Insert All" ON public.posts FOR INSERT WITH CHECK (true);

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

CREATE POLICY "Allow public read access for series" ON public.series FOR SELECT USING (true);
CREATE POLICY "Allow public read access for episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Allow public read access for bookings" ON public.bookings FOR SELECT USING (true);

CREATE POLICY "Allow users to insert own series" ON public.series FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow users to update own series" ON public.series FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Allow users to insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Allow users to update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = creator_id);
