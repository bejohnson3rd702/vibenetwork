-- 1. Create Channels Table
CREATE TABLE IF NOT EXISTS public.network_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_gated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Posts Table
CREATE TABLE IF NOT EXISTS public.network_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES public.network_channels(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Comments Table
CREATE TABLE IF NOT EXISTS public.network_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.network_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Likes Table
CREATE TABLE IF NOT EXISTS public.network_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.network_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.network_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(post_id, user_id), -- A user can only like a post once
    UNIQUE(comment_id, user_id) -- A user can only like a comment once
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.network_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_likes ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Channels: Anyone can read channels for their network.
CREATE POLICY "Anyone can view channels" ON public.network_channels FOR SELECT USING (true);
-- Only admins/network owners can create channels (simplified for now to allow all, but you can restrict later)
CREATE POLICY "Network admins can create channels" ON public.network_channels FOR INSERT WITH CHECK (true);

-- Posts: Anyone can read posts, users can create posts.
CREATE POLICY "Anyone can view posts" ON public.network_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.network_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON public.network_posts FOR DELETE USING (auth.uid() = author_id);

-- Comments: Anyone can read comments, users can create comments.
CREATE POLICY "Anyone can view comments" ON public.network_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.network_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.network_comments FOR DELETE USING (auth.uid() = author_id);

-- Likes: Anyone can read likes, users can create/delete their own likes.
CREATE POLICY "Anyone can view likes" ON public.network_likes FOR SELECT USING (true);
CREATE POLICY "Users can toggle likes" ON public.network_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove likes" ON public.network_likes FOR DELETE USING (auth.uid() = user_id);
