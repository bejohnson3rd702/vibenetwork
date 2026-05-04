import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

const VirtualCallRoom: React.FC = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  
  const [peerId, setPeerId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const myStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize WebRTC Peer
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    // Request camera/mic permissions
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myStream.current = stream;
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // Answer incoming calls automatically
        peer.on('call', (call) => {
          call.answer(stream);
          setIsConnected(true);
          call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
        alert("Camera or Microphone access denied. Please allow permissions to join the call.");
      });

    peerInstance.current = peer;

    return () => {
      // Cleanup on unmount
      if (myStream.current) {
        myStream.current.getTracks().forEach(track => track.stop());
      }
      peer.destroy();
    };
  }, []);

  const handleCall = () => {
    if (!targetId || !peerInstance.current || !myStream.current) return;
    
    const call = peerInstance.current.call(targetId, myStream.current);
    setIsConnected(true);
    
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });
  };

  const toggleAudio = () => {
    if (myStream.current) {
      const audioTrack = myStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (myStream.current) {
      const videoTrack = myStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (myStream.current) {
      myStream.current.getTracks().forEach(track => track.stop());
    }
    if (peerInstance.current) {
      peerInstance.current.destroy();
    }
    navigate(-1); // Go back to dashboard
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, letterSpacing: '1px' }}>Vibe 1-on-1 Session</h1>
        </div>
        
        {!isConnected && (
          <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '14px', color: '#ccc' }}>
             Waiting for partner...
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Remote Video (Full Screen) */}
        <div style={{ flex: 1, background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!isConnected && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎧</div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Waiting for connection...</h2>
              
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Your Connection ID:</span>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#D35400', letterSpacing: '1px', background: 'rgba(211,84,0,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '24px', wordBreak: 'break-all', userSelect: 'all' }}>
                  {peerId || 'Generating...'}
                </div>
                
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Enter Partner's ID to Connect:</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Paste ID here" 
                    value={targetId} 
                    onChange={(e) => setTargetId(e.target.value)}
                    style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--bg-surface-hover)', padding: '14px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <button 
                    onClick={handleCall}
                    disabled={!targetId}
                    style={{ padding: '14px 24px', background: targetId ? '#D35400' : '#444', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: targetId ? 'pointer' : 'not-allowed', transition: '0.2s' }}
                    onMouseOver={e=>{if(targetId)e.currentTarget.style.background='#E65100'}} onMouseOut={e=>{if(targetId)e.currentTarget.style.background='#D35400'}}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: isConnected ? 'block' : 'none' }} 
          />
        </div>

        {/* Local Video (Picture in Picture) */}
        <motion.div 
          drag
          dragConstraints={{ top: 20, left: 20, right: window.innerWidth - 320, bottom: window.innerHeight - 300 }}
          style={{ 
            position: 'absolute', bottom: '120px', right: '40px', 
            width: '280px', height: '180px', 
            background: 'var(--bg-color)', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.1)',
            overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', cursor: 'grab'
          }}
        >
          <video 
            ref={myVideoRef} 
            autoPlay 
            playsInline 
            muted // ALWAYS mute local video to prevent feedback loop
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} // Mirror local view
          />
          {isVideoMuted && (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VideoOff color="#666" size={32} />
            </div>
          )}
        </motion.div>

      </div>

      {/* Bottom Control Bar */}
      <div style={{ height: '90px', background: 'rgba(0,0,0,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '0 40px', position: 'relative' }}>
        
        <div style={{ position: 'absolute', left: '40px', color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#00ff88' : '#ff4d4d' }} />
          Room: {callId}
        </div>

        <button 
          onClick={toggleAudio}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: isAudioMuted ? '#ff4d4d' : 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
        >
          {isAudioMuted ? <MicOff color="#fff" /> : <Mic color="#fff" />}
        </button>

        <button 
          onClick={toggleVideo}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: isVideoMuted ? '#ff4d4d' : 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
        >
          {isVideoMuted ? <VideoOff color="#fff" /> : <Video color="#fff" />}
        </button>

        <button 
          onClick={endCall}
          style={{ padding: '0 30px', height: '50px', borderRadius: '25px', background: '#ff0000', color: 'var(--text-primary)', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '20px' }}
        >
          <PhoneOff size={18} />
          End Session
        </button>
      </div>
    </div>
  );
};

export default VirtualCallRoom;
