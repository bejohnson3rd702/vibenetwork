import React from 'react';
import { motion } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const MoreInfo: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const isTenant = wlConfig && wlConfig.domain !== 'vibenetwork.tv';
  const isAvo = wlConfig?.id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7' || wlConfig?.parent_network_id === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7';
  const isOlympian = wlConfig?.name?.toLowerCase().includes('olympia') || 
                     wlConfig?.domain?.includes('mrolympia.com') ||
                     wlConfig?.name?.toLowerCase().includes('muscle') ||
                     wlConfig?.name?.toLowerCase().includes('fitness');
  const isB2K = wlConfig?.name?.toLowerCase().includes('b2k') || 
                wlConfig?.domain?.includes('b2k.vibenetwork.tv');
  const isKple = wlConfig?.id === '33742e2f-430b-4c2d-9cba-42507891ef02' || 
                 wlConfig?.parent_network_id === '33742e2f-430b-4c2d-9cba-42507891ef02' ||
                 wlConfig?.name?.toLowerCase().includes('kple') ||
                 wlConfig?.domain?.includes('kpletv.org');
  const accentColor = wlConfig?.accent || 'var(--accent-primary)';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-color)', 
      paddingTop: '120px', 
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div className="hide-on-mobile" style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: accentColor, filter: 'blur(200px)', opacity: 0.15, zIndex: 0, borderRadius: '50%' }} />

      <div style={{ maxWidth: '1000px', width: '100%', padding: '0 40px', position: 'relative', zIndex: 2 }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1px' }}
        >
          {isAvo 
            ? (wlConfig?.parent_network_id ? `About AVO & ${wlConfig.name}` : 'About AVO Network')
            : (isB2K ? 'About B2K Network' : (isKple ? (wlConfig?.parent_network_id ? `About KPLE & ${wlConfig.name}` : 'About KPLE TV Network') : (isTenant ? `About ${wlConfig.name}` : 'About Vibe Network Architecture')))}
        </motion.h1>
        
        {isAvo ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '20px' }}>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0px' }}
            >
              These days, it seems like everything costs more than it’s worth. Whether it’s paying rent, buying a new outfit, or ordering avocado toast at brunch, we all feel it. That’s why we created AVO - a maker of high-quality garments sold at fair prices. You shouldn’t have to choose between affordability and quality, and with AVO, you don’t. You can have your avocado toast and eat it too.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                We source the same fabrics used by premium brands but keep prices affordable by selling directly to you instead of through retailers who mark them up. Simply put, we think it’s time you got your money’s worth. When you shop with AVO, that’s exactly what you’re getting.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}15 0%, rgba(0,0,0,0) 100%)`, 
                padding: '40px', 
                borderRadius: '24px', 
                border: `1px solid ${accentColor}33`,
                boxShadow: `0 10px 30px ${accentColor}08`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: accentColor, boxShadow: `0 0 12px ${accentColor}`
              }} />
              <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Supporting Student Athletes
              </h3>
              <p style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                20% of every AVO order is donated to the university’s female student-athlete NIL fund. At AVO, we believe that American-made, high-quality clothing doesn't have to be expensive, and it should be easy to support all student athletes.
              </p>
            </motion.div>
          </div>
        ) : isKple ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '20px' }}>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0px' }}
            >
              KPLE-TV is a broadcast facility located in Killeen/Ft Hood, Texas, broadcasting the Gospel since 1993. 
              We offer 24/7/365 of inspirational programming that appeals to a wide variety of those seeking Christian programming. 
              Understanding the diversity of the communities it serves, KPLE-TV offers programming in Spanish and English. 
              We are available on Roku, iOS, Google Play Store, Fire TV, Apple TV, and online, continuing to drive Christian programming that prepares all nations for a global revival of our Lord Jesus Christ.
            </motion.p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Our Goal
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                  We look to strengthen and expand our media technology platform to increase programming for viewers all over the world. 
                  Most importantly, it is a timely opportunity to engage viewers about the non-profit organizations within Bell County, 
                  educating them on how to network their services utilizing the station’s Local Events Calendar and broadcast announcement platform.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Community Outreach
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                  We believe in supporting Bell County's non-profit organizations that meet crucial community needs. 
                  Our station acts as a networking hub, helping these organizations share their vital services utilizing 
                  KPLE's Local Events Calendar, broadcast announcements, and public program interviews.
                </p>
              </motion.div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>
                Meet Our Team
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Jesus Christ */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '32px', 
                    borderRadius: '24px', 
                    border: `1px solid ${accentColor}44`,
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    width: '96px', 
                    height: '96px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    marginBottom: '24px', 
                    border: `3px solid ${accentColor}44`,
                    background: 'var(--bg-color)'
                  }}>
                    <img 
                      src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/yXMb4ZqlijZh6tBlO4Ca/media/6483a3ad6b8bf4c60c263f38.jpeg" 
                      alt="Jesus Christ" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                    Jesus Christ
                  </h3>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Our Lord & Savior
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                    Serving as the head and ultimate leader of KPLE's mission, guiding the station in sharing the Gospel, spreading salvation, and preparing all nations for a global revival.
                  </p>
                </motion.div>

                {/* Catherine Mason */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '32px', 
                    borderRadius: '24px', 
                    border: '1px solid var(--bg-surface-hover)'
                  }}
                >
                  <div style={{ 
                    width: '96px', 
                    height: '96px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    marginBottom: '24px', 
                    border: '3px solid var(--bg-surface-hover)',
                    background: 'var(--bg-color)'
                  }}>
                    <img 
                      src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/yXMb4ZqlijZh6tBlO4Ca/media/6483a5359868003ab8979823.jpeg" 
                      alt="Catherine Mason" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                    Catherine Mason
                  </h3>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Founder (1927–2022)
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                    Co-founded KPLE-TV alongside other faithful women after a calling to bring Christian television to Central Texas. With a Master's in early childhood education, she spent nearly 30 years leading the station, famously skydiving at age 81 to raise funds for digital equipment.
                  </p>
                </motion.div>

                {/* Kenneth Sorenson */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '32px', 
                    borderRadius: '24px', 
                    border: '1px solid var(--bg-surface-hover)'
                  }}
                >
                  <div style={{ 
                    width: '96px', 
                    height: '96px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    marginBottom: '24px', 
                    border: '3px solid var(--bg-surface-hover)',
                    background: 'var(--bg-color)'
                  }}>
                    <img 
                      src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/yXMb4ZqlijZh6tBlO4Ca/media/64ee3935ba2ab016887473a8.jpeg" 
                      alt="Chaplain Ken Sorenson" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                    Chaplain (COL) Ken Sorenson
                  </h3>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    General Manager
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                    Retired U.S. Army Chaplain (Colonel) with 33 years of military service, including deployments to Iraq and Afghanistan. Ken leads community relations, station vision, and coordinates the "Christian Revival Network" to broadcast the Gospel in over 100 languages.
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}15 0%, rgba(0,0,0,0) 100%)`, 
                padding: '40px', 
                borderRadius: '24px', 
                border: `1px solid ${accentColor}33`,
                boxShadow: `0 10px 30px ${accentColor}08`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: accentColor, boxShadow: `0 0 12px ${accentColor}`
              }} />
              <h3 style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Killeen Christian Broadcasting Corporation
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                KPLE-TV is operated by the Killeen Christian Broadcasting Corporation, a 501(c)3 not-for-profit media mission. 
                We are dedicated to broadcasting faith-based and family programming to communities across Central Texas and the world.
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '18px', color: 'var(--text-secondary)' }}>
                <span>Toll Free: </span>
                <a href="tel:8776405673" style={{ color: accentColor, textDecoration: 'none', fontWeight: 'bold' }}>(877) 640-5673</a>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '40px' }}
            >
              {isOlympian 
                ? "Mr. Olympia is the ultimate arena of professional bodybuilding. For more than half a century, the iconic competition has crowned the finest physiques on Earth, establishing a legacy of discipline, athletic brilliance, and physical perfection."
                : (isB2K 
                  ? "B2K is one of the most successful boy bands of the 2000s. Formed in 1998, the R&B group consists of Omarion, Lil' Fizz, J-Boog, and Raz-B. Celebrating their 25th anniversary, the members have reunited for the Boys 4 Life Tour alongside solo ventures."
                  : (isTenant 
                    ? `${wlConfig.heroCopy || 'The premiere destination for high quality digital content.'} Powered by Vibe Network.`
                    : "Vibe Network provides enterprise-grade, highly scalable white-label streaming architectures. Deploy high-fidelity, interactive broadcasting experiences tailored entirely to your brand's aesthetic."
                  )
                )
              }
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--bg-surface-hover)' }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
                {isOlympian ? 'About Mr. Olympia' : (isB2K ? 'About B2K' : (isTenant ? 'Our Platform' : 'Key Features'))}
              </h2>
              
              {isOlympian ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                  The official Mr. Olympia Network-to-Network (N2N) platform connects bodybuilding enthusiasts globally with exclusive media clips, event schedules, and official gear from legendary partner brands: Gold's Gym, Gaspari Nutrition, Rogue Fitness, Redcon1, and Gymshark. Together, we celebrate the passion and dedication that defines the fitness lifestyle.
                </p>
              ) : isB2K ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                  The official B2K Network-to-Network (N2N) platform aggregates exclusive content, new music pre-orders, and merchandise from B2K and the individual networks of all four members: Omarion, Lil' Fizz, J-Boog, and Raz-B. Experience the group's legendary R&B harmonies and keep up with their solo endeavors all in one place.
                </p>
              ) : isTenant ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.6 }}>
                   This is the autogenerated structural block for your requested <b>About Us</b> modular section. Connect your CMS to deploy actual structured content here.
                </p>
              ) : (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '18px', paddingLeft: '20px', lineHeight: 1.6 }}>
                  <li><b style={{ color: accentColor }}>Dynamic Tenancy:</b> Configure custom domains, logos, and color palettes on the fly.</li>
                  <li><b style={{ color: accentColor }}>High-Fidelity Streaming:</b> Support for ultra-low latency broadcasting using enterprise servers.</li>
                  <li><b style={{ color: accentColor }}>Real-Time Interactive Chat:</b> Global scaled websockets for millions of concurrent users.</li>
                  <li><b style={{ color: accentColor }}>Generative UI Components:</b> Seamlessly adapt the platform's look and feel with AI-assisted design tokens.</li>
                </ul>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoreInfo;
