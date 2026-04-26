import React, { useState, useRef } from 'react';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div 
      style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${item.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      
      {isHovered && item.videoUrl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {(() => {
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
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                autoPlay muted loop playsInline
              >
                <source src={item.videoUrl} type="video/mp4" />
              </video>
            );
          })()}
        </motion.div>
      )}

      {/* Ultra- Sleek Dynamic Gradients based on Hover State */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isHovered 
          ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%)' 
          : 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '30px 24px',
        transition: 'background 0.5s ease',
        zIndex: 2
      }}>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {item.tags.map(tag => (
            <span key={tag} style={{ 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#fff'
            }}>
              {tag}
            </span>
          ))}
        </div>
        
        <motion.h3 
          animate={{ y: isHovered ? -4 : 0 }} 
          transition={{ duration: 0.3 }}
          style={{ fontSize: '20px', lineHeight: 1.2, margin: 0, color: '#fff', fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          {item.title}
        </motion.h3>
        
        <AnimatePresence>
          {isHovered && isInfluencer && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              <span>View Architecture</span> <ArrowRight size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Sleek Central Play Overlay */}
      <AnimatePresence>
        {!isHovered && !isInfluencer && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, pointerEvents: 'none' }}
          >
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <Play fill="white" size={24} style={{ marginLeft: '4px' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edge Highlight */}
      <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', zIndex: 4, pointerEvents: 'none' }} />
    </motion.div>
  );

  return (
    <div 
      className="media-card slide-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        flexShrink: 0,
        height: '100%',
        aspectRatio: aspectRatio,
        cursor: 'pointer',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.5)',
        transition: 'all 0.4s ease',
        borderRadius: '24px',
        background: 'var(--bg-color)'
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
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => setIsDragging(false);

  // Set width dynamically so exactly 5 cards are visible at a time
  // The gap is 30px, so 4 gaps between 5 cards is 120px total. 120 / 5 = 24px subtracted from 20%
  const widthVal = 'calc(20% - 24px)';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '0px 0 60px', width: '100%', overflow: 'hidden' }}
    >
      <div className="px-mobile-sm" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.5px' }}>
            <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>{title}</span>
          </h2>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { if(scrollRef.current) scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' }) }} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--bg-surface-hover)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={e=>{e.currentTarget.style.background='var(--accent-primary)'; e.currentTarget.style.color='#fff'}} onMouseOut={e=>{e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.color='var(--text-primary)'}}>
              <ChevronLeft size={28} />
            </button>
            <button onClick={() => { if(scrollRef.current) scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' }) }} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--bg-surface-hover)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={e=>{e.currentTarget.style.background='var(--accent-primary)'; e.currentTarget.style.color='#fff'}} onMouseOut={e=>{e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.color='var(--text-primary)'}}>
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          style={{
            display: 'flex',
            gap: '30px',
            overflowX: 'auto',
            paddingBottom: '40px',
            paddingTop: '20px',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {items.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.6, delay: delay + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
              className="slider-item-mobile"
              key={item.id} 
              style={{ flexShrink: 0, width: widthVal, height: aspectRatio === '1/1' ? widthVal : 'auto' }}
              onClick={(e) => {
                if (isDragging && Math.abs(scrollRef.current!.scrollLeft - scrollLeft) > 10) {
                   e.preventDefault(); return;
                }
                if (onItemClick) onItemClick(item);
              }}
            >
              <SlideItem item={item} aspectRatio={aspectRatio} />
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </motion.section>
  );
};

export default SliderSection;
