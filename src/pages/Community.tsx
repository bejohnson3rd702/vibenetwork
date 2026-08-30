import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { MessageSquare, Hash, Image as ImageIcon, Send, Lock, Unlock, Plus, Trash2, Settings, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateFileSafety } from '../lib/fileSecurity';

interface CommunityProps {
  user: any;
  onAuthRequest?: () => void;
}

export default function Community({ user, onAuthRequest }: CommunityProps) {
  const { wlConfig } = useWhiteLabel();
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [pendingMediaUrl, setPendingMediaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelGated, setNewChannelGated] = useState(false);
  const [channelMenuId, setChannelMenuId] = useState<string | null>(null);

  const isOwner = !!(user && wlConfig?.owner_id && user.id === wlConfig.owner_id);
  const accent = wlConfig?.accent || '#00ff88';

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) setUserProfile(data);
      });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  useEffect(() => {
    if (!wlConfig?.id) return;
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('network_channels').select('*').eq('whitelabel_id', wlConfig.id).order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setChannels(data); setActiveChannel(data[0]);
        } else {
          const { data: newChannel } = await supabase.from('network_channels')
            .insert({ whitelabel_id: wlConfig.id, name: 'general', description: 'General community chat' }).select().single();
          if (newChannel) { setChannels([newChannel]); setActiveChannel(newChannel); }
        }
      } catch (err) {
        console.error('Failed to load channels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, [wlConfig?.id]);

  useEffect(() => {
    if (!activeChannel) return;
    const fetchPosts = async () => {
      const { data } = await supabase.from('network_posts')
        .select('*, author:profiles(id, username, avatar_url)')
        .eq('channel_id', activeChannel.id).order('created_at', { ascending: false }).limit(100);
      if (data) setPosts(data);
    };
    fetchPosts();
    const subscription = supabase.channel(`community-channel:${activeChannel.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'network_posts', filter: `channel_id=eq.${activeChannel.id}` }, () => { fetchPosts(); })
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, [activeChannel]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (fileInputRef.current) fileInputRef.current.value = '';

    const safety = validateFileSafety(file);
    if (!safety.safe) {
      toast.error(`⛔ Security Blocked: Executable files (${safety.blockedFileName}) are forbidden across the platform!`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) { toast.error('File too large. Max 50MB.'); return; }
    try {
      setUploadingMedia(true);
      const ext = file.name.split('.').pop() || 'bin';
      const filePath = `${user.id}/community_${Date.now()}.${ext}`;
      const { error } = await supabase!.storage.from('images').upload(filePath, file, { contentType: file.type });
      if (error) throw error;
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setPendingMediaUrl(data.publicUrl);
      toast.success('Media ready -- hit send!');
    } catch (err: any) {
      toast.error(`Upload failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handlePost = async () => {
    if ((!newPostContent.trim() && !pendingMediaUrl) || !user || !activeChannel) return;
    const { error } = await supabase.from('network_posts').insert({
      channel_id: activeChannel.id, author_id: user.id,
      content: newPostContent.trim() || '', media_url: pendingMediaUrl || null,
    });
    if (error) { toast.error('Failed to post. Please try again.'); return; }
    setNewPostContent(''); setPendingMediaUrl(null);
  };

  const handleAddChannel = async () => {
    if (!newChannelName.trim() || !wlConfig?.id) return;
    const slug = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase.from('network_channels')
      .insert({ whitelabel_id: wlConfig.id, name: slug, description: newChannelDesc.trim() || null, is_gated: newChannelGated })
      .select().single();
    if (error) { toast.error('Failed to create channel.'); return; }
    if (data) {
      setChannels(prev => [...prev, data]);
      setNewChannelName(''); setNewChannelDesc(''); setNewChannelGated(false); setShowAddChannel(false);
      toast.success('#' + data.name + ' created!');
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (!window.confirm('Delete this channel and all its posts? This cannot be undone.')) return;
    const { error } = await supabase.from('network_channels').delete().eq('id', channelId);
    if (error) { toast.error('Failed to delete channel.'); return; }
    const remaining = channels.filter(c => c.id !== channelId);
    setChannels(remaining);
    if (activeChannel?.id === channelId) setActiveChannel(remaining[0] || null);
    setChannelMenuId(null); toast.success('Channel deleted.');
  };

  const handleToggleGate = async (channel: any) => {
    const next = !channel.is_gated;
    const { error } = await supabase.from('network_channels').update({ is_gated: next }).eq('id', channel.id);
    if (error) { toast.error('Failed to update channel.'); return; }
    setChannels(prev => prev.map(c => c.id === channel.id ? { ...c, is_gated: next } : c));
    if (activeChannel?.id === channel.id) setActiveChannel((prev: any) => ({ ...prev, is_gated: next }));
    setChannelMenuId(null);
    toast.success(next ? 'Channel is now subscribers only.' : 'Channel is now public.');
  };

  const isGatedBlocked = activeChannel?.is_gated && !isOwner && !userProfile?.is_subscriber;
  const isVideo = (url: string) => /\.(mp4|mov|webm|ogg|avi|mkv)(\?|$)/i.test(url);

  if (loading) {
    return (
      <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', gap: '12px' }}>
        <MessageSquare size={20} color={accent} /> Loading Community...
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 120px)', minHeight: '600px', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', display: 'flex', color: '#fff', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }} onClick={() => channelMenuId && setChannelMenuId(null)}>

      {/* Sidebar */}
      <div style={{ width: '260px', background: 'rgba(0,0,0,0.5)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color={accent} /> Community
          </h2>
          {isOwner && (
            <button onClick={e => { e.stopPropagation(); setShowAddChannel(v => !v); }} title={showAddChannel ? 'Cancel' : 'New channel'} style={{ background: showAddChannel ? accent : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showAddChannel ? '#000' : '#fff', transition: '0.2s' }}>
              {showAddChannel ? <X size={15} /> : <Plus size={15} />}
            </button>
          )}
        </div>

        {isOwner && showAddChannel && (
          <div onClick={e => e.stopPropagation()} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid ' + accent + '33' }}>
            <input type="text" placeholder="channel-name" value={newChannelName} onChange={e => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            <input type="text" placeholder="Description (optional)" value={newChannelDesc} onChange={e => setNewChannelDesc(e.target.value)} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', userSelect: 'none' }}>
              <input type="checkbox" checked={newChannelGated} onChange={e => setNewChannelGated(e.target.checked)} style={{ accentColor: accent }} />
              Subscribers Only
            </label>
            <button onClick={handleAddChannel} disabled={!newChannelName.trim()} style={{ background: newChannelName.trim() ? accent : 'rgba(255,255,255,0.1)', color: newChannelName.trim() ? '#000' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 'bold', cursor: newChannelName.trim() ? 'pointer' : 'not-allowed', fontSize: '13px', transition: '0.2s' }}>
              Create Channel
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
          {channels.map(channel => (
            <div key={channel.id} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div onClick={() => { setActiveChannel(channel); setChannelMenuId(null); }} style={{ padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', background: activeChannel?.id === channel.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeChannel?.id === channel.id ? '#fff' : 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: activeChannel?.id === channel.id ? 700 : 400, transition: '0.15s', paddingRight: isOwner ? '34px' : '14px' }}>
                <Hash size={15} color={activeChannel?.id === channel.id ? accent : 'rgba(255,255,255,0.35)'} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px' }}>{channel.name}</span>
                {channel.is_gated && <Lock size={11} color="#ff6666" style={{ flexShrink: 0 }} />}
              </div>
              {isOwner && (
                <button onClick={e => { e.stopPropagation(); setChannelMenuId(channelMenuId === channel.id ? null : channel.id); }} title="Channel settings" style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: channelMenuId === channel.id ? accent : 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: '0.15s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = channelMenuId === channel.id ? accent : 'rgba(255,255,255,0.25)')}>
                  <Settings size={13} />
                </button>
              )}
              {isOwner && channelMenuId === channel.id && (
                <div style={{ position: 'absolute', left: 0, right: 0, zIndex: 100, top: 'calc(100% + 4px)', background: 'rgba(18,18,18,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', backdropFilter: 'blur(16px)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
                  <button onClick={() => handleToggleGate(channel)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: channel.is_gated ? '#ffcc44' : 'rgba(255,255,255,0.8)', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textAlign: 'left', width: '100%' }} onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')} onMouseOut={e => (e.currentTarget.style.background = 'none')}>
                    {channel.is_gated ? <><Unlock size={14} /> Make Public</> : <><Lock size={14} /> Make Subscribers Only</>}
                  </button>
                  <button onClick={() => handleDeleteChannel(channel.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textAlign: 'left', width: '100%' }} onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,50,50,0.08)')} onMouseOut={e => (e.currentTarget.style.background = 'none')}>
                    <Trash2 size={14} /> Delete Channel
                  </button>
                </div>
              )}
            </div>
          ))}
          {channels.length === 0 && (
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0' }}>
              {isOwner ? 'No channels yet. Create one above!' : 'No channels available yet.'}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        {activeChannel && (
          <div style={{ padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Hash size={20} color={accent} />
              {activeChannel.name}
              {activeChannel.is_gated && <span style={{ fontSize: '11px', background: 'rgba(255,68,68,0.12)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.25)', borderRadius: '20px', padding: '2px 10px', fontWeight: 700 }}>Subscribers Only</span>}
            </h3>
            {activeChannel.description && <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{activeChannel.description}</p>}
          </div>
        )}

        {isGatedBlocked ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '40px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,68,68,0.1)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,68,68,0.2)' }}>
              <Lock size={36} color="#ff6666" />
            </div>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Subscribers Only</h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', maxWidth: '340px', lineHeight: 1.7, fontSize: '15px' }}>This channel is exclusive to subscribers. Upgrade to unlock access and join the conversation.</p>
            <button style={{ background: accent, color: '#000', border: 'none', borderRadius: '24px', padding: '13px 36px', fontWeight: 900, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 20px ' + accent + '44', transition: '0.2s' }} onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.1)')} onMouseOut={e => (e.currentTarget.style.filter = 'none')}>
              Upgrade to Subscribe
            </button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column-reverse', gap: '14px' }}>
              {posts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: '40px 0', fontSize: '14px' }}>No posts yet in #{activeChannel?.name}. Be the first!</div>
              ) : (
                posts.map(post => (
                  <div key={post.id} style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, background: post.author?.avatar_url ? 'transparent' : 'rgba(255,255,255,0.1)', backgroundImage: post.author?.avatar_url ? 'url(' + post.author.avatar_url + ')' : undefined, backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid rgba(255,255,255,0.08)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{post.author?.username || 'Anonymous'}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {post.content && <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: '14px', lineHeight: 1.65, wordBreak: 'break-word' }}>{post.content}</div>}
                      {post.media_url && (
                        <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden', maxWidth: '460px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.3)' }}>
                          {isVideo(post.media_url) ? (
                            <video src={post.media_url} controls playsInline style={{ width: '100%', maxHeight: '300px', display: 'block' }} />
                          ) : (
                            <img src={post.media_url} alt="Post media" loading="lazy" style={{ width: '100%', maxHeight: '440px', objectFit: 'contain', display: 'block' }} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '14px 22px', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              {user ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: userProfile?.avatar_url ? 'transparent' : 'linear-gradient(135deg, ' + accent + ', #8A2BE2)', backgroundImage: userProfile?.avatar_url ? 'url(' + userProfile.avatar_url + ')' : undefined, backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    {pendingMediaUrl && (
                      <div style={{ padding: '10px 14px 0' }}>
                        <div style={{ position: 'relative', display: 'inline-block', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                          {isVideo(pendingMediaUrl) ? <video src={pendingMediaUrl} style={{ height: '72px', borderRadius: '10px', display: 'block' }} /> : <img src={pendingMediaUrl} alt="Preview" style={{ height: '72px', borderRadius: '10px', display: 'block', objectFit: 'cover' }} />}
                          <button onClick={() => setPendingMediaUrl(null)} style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.85)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>x</button>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px 4px 16px' }}>
                      <input type="text" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handlePost()} placeholder={activeChannel ? 'Message #' + activeChannel.name : 'Select a channel...'} disabled={!activeChannel} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '9px 0' }} />
                      <label title={uploadingMedia ? 'Uploading...' : 'Attach image or video'} style={{ cursor: uploadingMedia ? 'not-allowed' : 'pointer', padding: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', opacity: uploadingMedia ? 0.5 : 1, transition: '0.15s', flexShrink: 0 }}>
                        <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleMediaUpload} style={{ display: 'none' }} disabled={uploadingMedia} />
                        <ImageIcon size={19} color={pendingMediaUrl ? accent : 'rgba(255,255,255,0.45)'} />
                      </label>
                      <button onClick={handlePost} disabled={!newPostContent.trim() && !pendingMediaUrl} style={{ background: (newPostContent.trim() || pendingMediaUrl) ? accent : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (newPostContent.trim() || pendingMediaUrl) ? 'pointer' : 'not-allowed', transition: '0.2s', flexShrink: 0 }}>
                        <Send size={15} color={(newPostContent.trim() || pendingMediaUrl) ? '#000' : 'rgba(255,255,255,0.25)'} style={{ marginLeft: '2px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', padding: '10px', fontSize: '14px' }}>
                  Please{' '}
                  <span onClick={onAuthRequest} style={{ color: accent, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>log in</span>
                  {' '}to participate in the community.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
