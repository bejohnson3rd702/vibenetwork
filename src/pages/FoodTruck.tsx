import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Calendar, MessageSquare, Camera, CheckCircle, ChevronRight, Phone, Send } from 'lucide-react';

const FoodTruck: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length > 5) {
      setSubscribed(true);
      setPhoneNumber('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="food-truck-theme" style={{ backgroundColor: '#111', color: '#fff', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      
      {/* 🔴 FLOATING "ORDER NOW" BUTTON FOR MOBILE (Sticky Bottom) */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: '90%', maxWidth: '400px' }}>
        <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#ff3b30', color: '#fff', border: 'none', fontSize: '18px', fontWeight: '800', boxShadow: '0 8px 20px rgba(255, 59, 48, 0.4)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <ChevronRight size={24} />
          ORDER AHEAD NOW
        </button>
      </div>

      {/* 1. HERO SECTION */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1565123409695-4bec56e62744?auto=format&fit=crop&q=80&w=2500")', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
        {/* Dark Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), #111)', zIndex: 1 }} />
        
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '600px', marginTop: '-50px' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'inline-block', background: '#ff3b30', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '14px', letterSpacing: '1px', marginBottom: '20px', boxShadow: '0 0 20px rgba(255,59,48,0.5)' }}>
            🔥 WE'RE OPEN NOW IN LAS VEGAS
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(40px, 8vw, 70px)', fontWeight: '900', lineHeight: 1.1, margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            The Best <span style={{ color: '#ffcc00' }}>Tacos</span> In The Desert.
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '30px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <MapPin size={24} color="#ff3b30" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '18px', display: 'block' }}>Current Location</strong>
                <span style={{ color: '#aaa', fontSize: '15px' }}>Fremont Street Experience (Near the Mantis)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Clock size={24} color="#ffcc00" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '18px', display: 'block' }}>Hours Today</strong>
                <span style={{ color: '#aaa', fontSize: '15px' }}>8:00 PM - 2:00 AM (or until sold out)</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
            <button style={{ padding: '16px', borderRadius: '12px', background: '#fff', color: '#000', border: 'none', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Navigation size={20} /> GET DIRECTIONS
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. TODAY'S MENU */}
      <section style={{ padding: '80px 20px', background: '#111', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '40px', color: '#ffcc00' }}>TODAY'S MENU</h2>
          
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* Menu Item 1 */}
            <div style={{ background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
              <div style={{ height: '200px', backgroundImage: 'url("https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Birria Tacos (3)</h3>
                  <span style={{ color: '#ffcc00', fontWeight: '800', fontSize: '18px' }}>$14</span>
                </div>
                <p style={{ color: '#888', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>Slow-cooked beef, melted cheese, cilantro, onions. Served with rich consommé for dipping.</p>
              </div>
            </div>

            {/* Menu Item 2 */}
            <div style={{ background: '#1a1a1a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
              <div style={{ height: '200px', backgroundImage: 'url("https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Loaded Asada Fries</h3>
                  <span style={{ color: '#ffcc00', fontWeight: '800', fontSize: '18px' }}>$16</span>
                </div>
                <p style={{ color: '#888', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>Crispy fries topped with carne asada, guacamole, sour cream, and our secret sauce.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHERE WE'LL BE NEXT (Schedule) */}
      <section style={{ padding: '60px 20px', background: '#1a1a1a' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
            <Calendar size={28} color="#ff3b30" />
            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>WHERE WE'LL BE NEXT</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#222', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #ff3b30' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '18px', marginBottom: '4px' }}>Tomorrow</strong>
                <span style={{ color: '#888', fontSize: '14px' }}>Arts District (First Friday)</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>5PM - 11PM</span>
            </div>
            
            <div style={{ background: '#222', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #444' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '18px', marginBottom: '4px' }}>Saturday</strong>
                <span style={{ color: '#888', fontSize: '14px' }}>Las Vegas Motor Speedway</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>12PM - 8PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. JOIN THE CREW (SMS Signup) */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(135deg, #ff3b30, #cc0000)', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <MessageSquare size={48} color="#fff" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 16px 0' }}>GET SECRET MENU DROPS</h2>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 30px 0', lineHeight: 1.5 }}>
            Join our SMS list. We text out our live location and offer exclusive discounts before we sell out. No spam, just tacos.
          </p>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="tel" 
              placeholder="Enter your phone number" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', outline: 'none' }}
              required
            />
            <button type="submit" style={{ padding: '16px 24px', borderRadius: '12px', background: '#111', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {subscribed ? <CheckCircle size={20} color="#00ff00" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </section>

      {/* 5. SOCIAL PROOF & CATERING */}
      <section style={{ padding: '80px 20px', background: '#111', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Camera size={40} color="#E1306C" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '40px' }}>FOLLOW THE HUSTLE</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '60px' }}>
            {/* Fake Instagram Grid */}
            <div style={{ aspectRatio: '1/1', background: 'url("https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&q=80&w=400")', backgroundSize: 'cover', borderRadius: '8px' }} />
            <div style={{ aspectRatio: '1/1', background: 'url("https://images.unsplash.com/photo-1615865417488-82550186173d?auto=format&fit=crop&q=80&w=400")', backgroundSize: 'cover', borderRadius: '8px' }} />
            <div style={{ aspectRatio: '1/1', background: 'url("https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&q=80&w=400")', backgroundSize: 'cover', borderRadius: '8px' }} />
          </div>

          <div style={{ background: '#1a1a1a', padding: '40px 20px', borderRadius: '24px', border: '1px dashed #444' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px', color: '#ffcc00' }}>WANT US AT YOUR EVENT?</h3>
            <p style={{ color: '#888', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
              We cater private parties, corporate events, and festivals in the Vegas area. Book us before our calendar fills up.
            </p>
            <button style={{ padding: '14px 28px', borderRadius: '30px', border: '2px solid #fff', background: 'transparent', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              INQUIRE ABOUT CATERING
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 20px 100px 20px', background: '#000', textAlign: 'center', borderTop: '1px solid #222' }}>
        <h4 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px' }}>VEGAS TACO TRUCK</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#888', marginBottom: '20px' }}>
          <Camera size={24} cursor="pointer" />
          <Phone size={24} cursor="pointer" />
        </div>
        <p style={{ color: '#444', fontSize: '12px' }}>© 2026 Vegas Taco Truck. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default FoodTruck;
