import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, EffectCoverflow } from 'swiper/modules';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/effect-coverflow';

interface Item {
  id: number;
  title: string;
  image: string;
  tags: string[];
  videoUrl?: string;
}

interface SliderSectionProps {
  title: string;
  items: Item[];
  delay?: number;
  aspectRatio?: string;
  sizeMultiplier?: number;
  onItemClick?: (item: Item) => void;
}

const SlideItem: React.FC<{ item: Item, aspectRatio: string, onClick?: () => void }> = ({ item, aspectRatio, onClick }) => {
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
          transition: 'opacity 0.5s ease',
          opacity: isHovered ? 0 : 1,
        }}
      />
      
      {/* Video element that plays only on hover */}
      {isHovered && item.videoUrl && (
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
        <h3 style={{ fontSize: '16px', margin: 0 }}>{item.title}</h3>
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
            boxShadow: '0 0 20px rgba(229,9,20,0.4)'
          }}>
            <Play fill="white" size={24} style={{ marginLeft: '4px' }} />
          </div>
        </div>
      )}
    </>
  );

  const containerStyle = { 
    borderRadius: '8px', 
    overflow: 'hidden', 
    position: 'relative',
    height: '100%',
    width: '100%',
    aspectRatio: aspectRatio,
    cursor: 'pointer',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    zIndex: isHovered ? 10 : 1,
    display: 'block',
    textDecoration: 'none',
    color: 'inherit'
  };

  return (
    <div 
      className="media-card slide-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={containerStyle as any}
    >
      {innerContent}
    </div>
  );
};

const SliderSection: React.FC<SliderSectionProps> = ({ title, items, delay = 0, aspectRatio = '16/9', sizeMultiplier = 1, onItemClick }) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      style={{ padding: '0px 0 16px', width: '100%', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{ 
          fontSize: '22px', 
          marginBottom: '12px', 
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ color: 'white' }}>{title}</span>
        </h2>
        
        <Swiper
          modules={[Navigation, A11y, EffectCoverflow]}
          spaceBetween={16}
          slidesPerView={1.1}
          navigation
          effect="coverflow"
          grabCursor={false}
          centeredSlides={false}
          preventClicks={false}
          preventClicksPropagation={false}
          simulateTouch={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1.5 * sizeMultiplier },
            1024: { slidesPerView: 2.8 * sizeMultiplier },
            1280: { slidesPerView: 3.5 * sizeMultiplier },
          }}
          style={{ overflow: 'visible', paddingBottom: '10px' }}
        >
          {items.map((item) => (
            <SwiperSlide 
              key={item.id} 
              style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }}
              onClick={() => {
                // Official Swiper React implementation guarantees dragging physics vs click resolution here!
                if (onItemClick) onItemClick(item);
              }}
            >
              <SlideItem item={item} aspectRatio={aspectRatio} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style>{`
        .slide-container:hover .play-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </motion.section>
  );
};

export default SliderSection;
