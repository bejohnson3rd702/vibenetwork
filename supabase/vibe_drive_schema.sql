-- Migration Script: Vibe Drive (Google Drive Alternative)

-- 1. Create drive_files table
CREATE TABLE IF NOT EXISTS public.drive_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path inside the storage bucket (e.g. "creator_uuid/file_uuid_name.pdf")
    file_type TEXT NOT NULL, -- e.g. "image", "video", "audio", "pdf", "archive", "document", "other"
    size_bytes BIGINT NOT NULL,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id) ON DELETE SET NULL,
    access_level TEXT NOT NULL DEFAULT 'public', -- 'public', 'subscribers'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.drive_files ENABLE ROW LEVEL SECURITY;

-- Policies for drive_files
DROP POLICY IF EXISTS "Public select drive_files" ON public.drive_files;
CREATE POLICY "Public select drive_files" ON public.drive_files FOR SELECT USING (
    creator_id = auth.uid() 
    OR access_level = 'public' 
    OR (
        access_level = 'subscribers' 
        AND EXISTS (
            SELECT 1 FROM public.user_follows 
            WHERE user_id = auth.uid() 
            AND target_profile_id = creator_id 
            AND type = 'subscribe'
        )
    )
);

DROP POLICY IF EXISTS "Creators can manage own drive_files" ON public.drive_files;
CREATE POLICY "Creators can manage own drive_files" ON public.drive_files FOR ALL USING (auth.uid() = creator_id);

-- 2. Add storage limits to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS storage_limit_bytes BIGINT DEFAULT 10737418240; -- 10 GB
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0;

-- 3. Setup vibe-drive storage bucket (private, public = false)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vibe-drive', 'vibe-drive', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for vibe-drive
DROP POLICY IF EXISTS "Select vibe-drive" ON storage.objects;
CREATE POLICY "Select vibe-drive" ON storage.objects FOR SELECT USING (
    bucket_id = 'vibe-drive' 
    AND (
        auth.uid() = owner 
        OR EXISTS (
            SELECT 1 FROM public.drive_files 
            WHERE file_path = name 
            AND (
                access_level = 'public' 
                OR (
                    access_level = 'subscribers' 
                    AND EXISTS (
                        SELECT 1 FROM public.user_follows 
                        WHERE user_id = auth.uid() 
                        AND target_profile_id = creator_id 
                        AND type = 'subscribe'
                    )
                )
            )
        )
    )
);

DROP POLICY IF EXISTS "Insert vibe-drive" ON storage.objects;
CREATE POLICY "Insert vibe-drive" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'vibe-drive' 
    AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Delete vibe-drive" ON storage.objects;
CREATE POLICY "Delete vibe-drive" ON storage.objects FOR DELETE USING (
    bucket_id = 'vibe-drive' 
    AND auth.uid() = owner
);
