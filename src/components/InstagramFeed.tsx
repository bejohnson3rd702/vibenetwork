import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { WINGS_IG_POSTS } from '../lib/n2n';

interface PostProps {
  post: typeof WINGS_IG_POSTS[0];
  accent: string;
}

const InstagramPostCard: React.FC<PostProps> = ({ post, accent }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(parseInt(post.likes.replace(/,/g, '')));
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const handleDoubleTap = () => {
    if (!liked) {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    }
    setShowHeartOverlay(true);
    setTimeout(() => {
      setShowHeartOverlay(false);
    }, 800);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [...prev, newComment]);
    setNewComment('');
  };

  const formattedCaption = post.caption.split(' ').map((word, i) => {
    if (word.startsWith('#')) {
      return (
        <span 
          key={i} 
          onClick={() => window.open(`https://www.instagram.com/explore/tags/${word.slice(1)}/`, '_blank')}
          style={{ color: '#0095F6', cursor: 'pointer', fontWeight: 500 }}
        >
          {word}{' '}
        </span>
      );
    }
    return word + ' ';
  });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      marginBottom: '30px',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${accent}`,
            padding: '2px',
            background: '#000',
          }}>
            <img 
              src="/n2n/inner-page-logo-min-1.png" 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 800 }}>wingsofstrength</span>
              {/* Verified badge */}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#0095F6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Las Vegas, Nevada</span>
          </div>
        </div>
        <button 
          onClick={() => window.open('https://www.instagram.com/wingsofstrength/', '_blank')}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image Container */}
      <div 
        onDoubleClick={handleDoubleTap}
        style={{
          position: 'relative',
          aspectRatio: '1/1',
          width: '100%',
          overflow: 'hidden',
          background: '#050505',
          cursor: 'pointer',
        }}
      >
        <img 
          src={post.image} 
          alt="Instagram content" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Double click heart animation */}
        {showHeartOverlay && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.1)',
            zIndex: 10,
          }}>
            <svg 
              viewBox="0 0 24 24" 
              width="80" 
              height="80" 
              fill="#FF3040" 
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
                transform: 'scale(1.2)',
                animation: 'heartBeat 0.8s ease forwards',
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={handleLike}
              style={{ background: 'none', border: 'none', color: liked ? '#FF3040' : '#fff', cursor: 'pointer', padding: 0 }}
            >
              <Heart size={24} fill={liked ? '#FF3040' : 'none'} style={{ transition: 'transform 0.1s ease' }} />
            </button>
            <button 
              onClick={() => window.open('https://www.instagram.com/wingsofstrength/', '_blank')}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              <MessageCircle size={24} />
            </button>
            <button 
              onClick={() => window.open('https://www.instagram.com/wingsofstrength/', '_blank')}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
            >
              <Send size={24} />
            </button>
          </div>
          <button 
            onClick={() => window.open('https://www.instagram.com/wingsofstrength/', '_blank')}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
          >
            <Bookmark size={24} />
          </button>
        </div>

        {/* Likes Count */}
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          {likesCount.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#eee', marginBottom: '8px' }}>
          <span style={{ fontWeight: 800, color: '#fff', marginRight: '8px', cursor: 'pointer' }} onClick={() => window.open('https://www.instagram.com/wingsofstrength/', '_blank')}>wingsofstrength</span>
          {formattedCaption}
        </div>

        {/* Dynamic Comments List */}
        {comments.map((comment, index) => (
          <div key={index} style={{ fontSize: '14px', lineHeight: '1.5', color: '#eee', marginBottom: '4px' }}>
            <span style={{ fontWeight: 800, color: '#fff', marginRight: '8px' }}>visitor</span>
            <span>{comment}</span>
          </div>
        ))}

        {/* View on Instagram Link */}
        <div 
          onClick={() => window.open('https://www.instagram.com/wingsofstrength/', '_blank')}
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'inline-block', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}
        >
          View on Instagram
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleAddComment} style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.1)',
      }}>
        <input 
          type="text" 
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            padding: 0,
          }}
        />
        <button 
          type="submit"
          disabled={!newComment.trim()}
          style={{
            background: 'none',
            border: 'none',
            color: newComment.trim() ? '#0095F6' : 'rgba(0,149,246,0.3)',
            fontWeight: 800,
            fontSize: '14px',
            cursor: newComment.trim() ? 'pointer' : 'default',
            padding: 0,
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

const InstagramFeed: React.FC<{ accent: string }> = ({ accent }) => {
  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
      {WINGS_IG_POSTS.slice(0, 3).map(post => (
        <InstagramPostCard key={post.id} post={post} accent={accent} />
      ))}
      <style>{`
        @keyframes heartBeat {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.9; }
          65% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default InstagramFeed;
