-- Performance Indexing for Post Likes and Comments
-- Since TrendingFeed and Profile dashboards join/aggregate posts, comments, and likes,
-- indexing the foreign keys is crucial to avoid sequential scans.

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
