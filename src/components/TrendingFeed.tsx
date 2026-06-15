import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, MessageSquare, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { mergeQueryParams } from '../lib/n2n';

interface Creator {
  id: string;
  username: string;
  avatar_url: string;
  whitelabel_id?: string;
}

interface ProcessedPost {
  id: string;
  content: string;
  imageUrl?: string;
  created_at: string;
  creator: Creator;
  likesCount: number;
  commentsCount: number;
  views: number;
  networkName?: string;
}

export default function TrendingFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ProcessedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Fetch all posts with creator profile, post_likes and post_comments
        const [postsResponse, networksResponse] = await Promise.all([
          supabase
            .from('posts')
            .select(`
              id,
              content,
              image_url,
              likes,
              created_at,
              creator_id,
              creator:profiles(id, username, avatar_url, whitelabel_id),
              post_likes(id),
              post_comments(id)
            `),
          supabase
            .from('whitelabel_configs')
            .select('id, name')
        ]);

        if (cancelled) return;

        if (postsResponse.error) {
          console.error("Error fetching trending posts:", postsResponse.error);
          setLoading(false);
          return;
        }

        const rawPosts = postsResponse.data || [];
        const rawNetworks = networksResponse.data || [];

        // Map network IDs to names
        const networkMap: Record<string, string> = {};
        rawNetworks.forEach((n: any) => {
          networkMap[n.id] = n.name;
        });

        // Process posts: calculate views and attach network names
        const processed: ProcessedPost[] = rawPosts.map((p: any) => {
          const creatorObj = Array.isArray(p.creator) ? p.creator[0] : p.creator;
          const likesCount = p.post_likes ? p.post_likes.length : (p.likes || 0);
          const commentsCount = p.post_comments ? p.post_comments.length : 0;

          // Deterministic view count based on likes, comments, and UUID hash
          const hash = p.id ? parseInt(p.id.substring(0, 8), 16) : 0;
          const baseViews = (hash % 1200) + 150; // Stable view count between 150 and 1350
          const views = baseViews + likesCount * 14 + commentsCount * 35;

          const networkId = creatorObj?.whitelabel_id;
          let networkName = networkId ? networkMap[networkId] : undefined;

          // Normalize short names for college networks
          if (networkName) {
            networkName = networkName
              .replace(/University of /gi, '')
              .replace(/ University/gi, '')
              .toUpperCase();
          }

          return {
            id: p.id,
            content: p.content || '',
            imageUrl: p.image_url || undefined,
            created_at: p.created_at,
            creator: {
              id: creatorObj?.id || p.creator_id,
              username: creatorObj?.username || 'Creator',
              avatar_url: creatorObj?.avatar_url || '',
              whitelabel_id: networkId
            },
            likesCount,
            commentsCount,
            views,
            networkName
          };
        });

        // Sort by views descending
        processed.sort((a, b) => b.views - a.views);

        // Limit to top 20 posts
        setPosts(processed.slice(0, 20));
      } catch (err) {
        console.error("TrendingFeed crash:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatCount = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Loading trending moments...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show the section if there are no posts
  }

  const visiblePosts = posts.slice(0, limit);

  return (
    <section style={{ padding: '60px 0', width: '100%', overflow: 'hidden', background: 'transparent' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
            <span style={{ width: '4px', height: '28px', borderRadius: '4px', background: 'var(--accent-primary)', boxShadow: '0 0 12px var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Trending Moments <Sparkles size={20} color="var(--accent-primary)" style={{ verticalAlign: 'middle' }} />
            </span>
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Top 20 Platform Highlights
          </span>
        </div>

        {/* Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          <AnimatePresence>
            {visiblePosts.map((post) => {
              const profileLink = post.creator.whitelabel_id
                ? `/profile/${post.creator.id}?tenant=${post.creator.whitelabel_id}`
                : `/profile/${post.creator.id}`;

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    window.location.href = mergeQueryParams(profileLink, window.location.search);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div>
                    {/* Creator Info */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                      <img 
                        src={post.creator.avatar_url || `/n2n/default_avatar.png`} 
                        alt={post.creator.username}
                        referrerPolicy="no-referrer"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.08)' }} 
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.creator.username}
                          </span>
                          <ShieldCheck size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(post.created_at)}</span>
                      </div>

                      {post.networkName && (
                        <span style={{ 
                          background: 'rgba(255, 255, 255, 0.06)', 
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '4px 8px', 
                          borderRadius: '8px', 
                          fontSize: '9px',
                          fontWeight: 900,
                          color: 'var(--accent-primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {post.networkName}
                        </span>
                      )}
                    </div>

                    {/* Post Content */}
                    <p style={{ 
                      fontSize: '14px', 
                      lineHeight: 1.5, 
                      color: 'var(--text-secondary)',
                      margin: '0 0 16px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {post.content}
                    </p>

                    {/* Post Image */}
                    {post.imageUrl && (
                      <div style={{
                        width: '100%',
                        aspectRatio: '16/10',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '16px',
                        background: 'rgba(0,0,0,0.2)'
                      }}>
                        <img 
                          src={post.imageUrl} 
                          alt="Post media" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>
                    )}
                  </div>

                  {/* Analytics Stats */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    fontSize: '12px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`${post.views} views`}>
                      <Eye size={14} /> {formatCount(post.views)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`${post.likesCount} likes`}>
                      <Heart size={14} /> {formatCount(post.likesCount)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`${post.commentsCount} comments`}>
                      <MessageSquare size={14} /> {formatCount(post.commentsCount)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button */}
        {posts.length > 8 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setLimit(prev => prev === 8 ? 20 : 8)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--accent-primary)';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {limit === 8 ? (
                <>
                  Show More <ChevronDown size={16} />
                </>
              ) : (
                <>
                  Show Less <ChevronUp size={16} />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
