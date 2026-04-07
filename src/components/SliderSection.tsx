import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Item {
  id: number | string;
  title: string;
  image: string;
  tags: string[];
  videoUrl?: string;
  linkUrl?: string;
}

interface SliderSectionProps {
  title: string;
  items: Item[];
  delay?: number;
  aspectRatio?: string;
  sizeMultiplier?: number;
  onItemClick?: (item: Item) => void;
}

const SlideItem: React.FC<{ item: Item, aspectRatio: string, onClick?: () => void }> = ({ item, aspectRatio }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInfluencer = !item.videoUrl || (item.tags && item.tags.includes('Influencer Channel'));

  const innerContent = (
    <>
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${item.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.5s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />
      
      {isHovered && item.videoUrl && (
        (() => {
          const match = item.videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
          const ytId = (match && match[2].length === 11) ? match[2] : null;
          if (ytId) {
            return (
              <iframe 
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&playsinline=1&controls=0&disablekb=1&loop=1&playlist=${ytId}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', border: 'none' }}
                allow="autoplay; encrypted-media"
                title={item.title}
              />
            );
          }
          return (
            <video 
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={item.videoUrl} type="video/mp4" />
            </video>
          );
        })()
      )}

      <div style={{
        position: 'absolute',
        inset: 0,
        background: isHovered 
          ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)' 
          : 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {item.tags.map(tag => (
            <span key={tag} style={{ 
              background: 'var(--accent-primary)', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {tag}
            </span>
          ))}
        </div>
        <h3 style={{ fontSize: '16px', margin: 0, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{item.title}</h3>
        {isInfluencer && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#00aaff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View Architecture</span> <Play size={10} fill="#00aaff" />
          </div>
        )}
      </div>
      
      {!isHovered && !isInfluencer && (
        <div className="play-overlay" style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,85,255,0.4)'
          }}>
            <Play fill="white" size={24} style={{ marginLeft: '4px' }} />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div 
      className="media-card slide-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        height: '100%',
        aspectRatio: aspectRatio,
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {innerContent}
    </div>
  );
};

const SliderSection: React.FC<SliderSectionProps> = ({ title, items, delay = 0, aspectRatio = '16/9', onItemClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  // Determine width based on aspect ratio
  const widthVal = aspectRatio === '1/1' ? '280px' : aspectRatio === '3/4' ? '280px' : '380px';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      style={{ padding: '0px 0 24px', width: '100%', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ 
          fontSize: '22px', 
          marginBottom: '20px', 
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ color: 'white' }}>{title}</span>
        </h2>
        
        <div 
          ref={scrollRef}
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingBottom: '20px',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // hide scrollbar for firefox
          }}
          className="hide-scrollbar"
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              style={{ width: widthVal, height: aspectRatio === '1/1' ? widthVal : 'auto' }}
              onClick={(e) => {
                // Ignore click if user was dragging
                if (isDragging && Math.abs(scrollRef.current!.scrollLeft - scrollLeft) > 10) {
                   e.preventDefault();
                   return;
                }
                if (onItemClick) onItemClick(item);
              }}
            >
              <SlideItem item={item} aspectRatio={aspectRatio} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .slide-container:hover .play-overlay {
          opacity: 1 !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
};

export default SliderSection;
