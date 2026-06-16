import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { MessageSquare, Hash, Image as ImageIcon, Send, Lock } from 'lucide-react';

export default function Community({ user }: { user: any }) {
  const { wlConfig } = useWhiteLabel();
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setUserProfile(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!wlConfig?.id) return;
    
    const fetchChannels = async () => {
      const { data } = await supabase
        .from('network_channels')
        .select('*')
        .eq('whitelabel_id', wlConfig.id)
        .order('created_at', { ascending: true });
        
      if (data && data.length > 0) {
        setChannels(data);
        setActiveChannel(data[0]);
      } else {
        // Create default channel if none exist (temporary auto-setup for testing)
        const { data: newChannel } = await supabase
          .from('network_channels')
          .insert({ whitelabel_id: wlConfig.id, name: 'general', description: 'General community chat' })
          .select()
          .single();
        if (newChannel) {
          setChannels([newChannel]);
          setActiveChannel(newChannel);
        }
      }
      setLoading(false);
    };

    fetchChannels();
  }, [wlConfig?.id]);

  useEffect(() => {
    if (!activeChannel) return;

    const fetchPosts = async () => {
      const { data } = await supabase
        .from('network_posts')
        .select(`
          *,
          author:profiles(id, username, avatar_url)
        `)
        .eq('channel_id', activeChannel.id)
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (data) setPosts(data);
    };

    fetchPosts();

    // Subscribe to new posts
    const subscription = supabase
      .channel(`public:network_posts:channel_id=eq.${activeChannel.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'network_posts', filter: `channel_id=eq.${activeChannel.id}` }, (payload) => {
        // Note: For full details we would need to join the profile, simplified here
        setPosts(prev => [payload.new, ...prev]);
        fetchPosts(); // Quick re-fetch to get author details
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeChannel]);

  const handlePost = async () => {
    if (!newPostContent.trim() || !user || !activeChannel) return;

    await supabase.from('network_posts').insert({
      channel_id: activeChannel.id,
      author_id: user.id,
      content: newPostContent
    });

    setNewPostContent('');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading Community...</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', minHeight: '600px', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', display: 'flex', color: '#fff', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Sidebar - Channels */}
      <div style={{ width: '280px', background: 'rgba(0,0,0,0.5)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} color={wlConfig?.accent || '#00ff88'} /> Community
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {channels.map(channel => (
            <div 
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              style={{ 
                padding: '12px 16px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                background: activeChannel?.id === channel.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeChannel?.id === channel.id ? '#fff' : 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: activeChannel?.id === channel.id ? 'bold' : 'normal',
                transition: '0.2s'
              }}
            >
              <Hash size={16} color={activeChannel?.id === channel.id ? (wlConfig?.accent || '#00ff88') : 'rgba(255,255,255,0.4)'} />
              {channel.name}
              {channel.is_gated && <Lock size={12} color="#ff4444" style={{ marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Channel Header */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={24} color={wlConfig?.accent || '#00ff88'} />
            {activeChannel?.name}
          </h3>
          <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            {activeChannel?.description || 'Welcome to the channel'}
          </p>
        </div>

        {/* Posts Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column-reverse', gap: '20px' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: '40px' }}>No posts in this channel yet. Be the first!</div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backgroundImage: `url(${post.author?.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>{post.author?.username || 'Anonymous'}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: 1.6 }}>
                    {post.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px 30px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <input 
                type="text" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                placeholder={`Message #${activeChannel?.name}`}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', outline: 'none' }}
              />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={20} color="rgba(255,255,255,0.5)" />
              </button>
              <button 
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                style={{ background: newPostContent.trim() ? (wlConfig?.accent || '#00ff88') : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newPostContent.trim() ? 'pointer' : 'not-allowed', transition: '0.2s' }}
              >
                <Send size={18} color={newPostContent.trim() ? '#000' : 'rgba(255,255,255,0.3)'} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '10px' }}>
              Please <span style={{ color: wlConfig?.accent || '#00ff88', cursor: 'pointer', fontWeight: 'bold' }}>log in</span> to participate in the community.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
