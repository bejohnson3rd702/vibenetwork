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
    <div style={{ height: '100vh', width: '100vw', background: '#050505', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>Vibe 1-on-1 Session</h1>
          <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '14px' }}>Room ID: {callId}</p>
        </div>
        
        {!isConnected && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Your Connection ID: <br/><b style={{ color: '#fff' }}>{peerId}</b></span>
            <input 
              type="text" 
              placeholder="Paste Partner's ID" 
              value={targetId} 
              onChange={(e) => setTargetId(e.target.value)}
              style={{ background: '#111', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff', width: '200px', outline: 'none' }}
            />
            <button 
              onClick={handleCall}
              style={{ padding: '12px 24px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Connect
            </button>
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Remote Video (Full Screen) */}
        <div style={{ flex: 1, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!isConnected && (
            <div style={{ color: '#444', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎧</div>
              <p>Waiting for connection...</p>
              <p style={{ fontSize: '12px', color: '#666', maxWidth: '300px', margin: '0 auto', lineHeight: '1.5' }}>Share your Connection ID with your partner, or paste theirs in the top right to start the call.</p>
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
            background: '#000', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.1)',
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
            <div style={{ position: 'absolute', inset: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VideoOff color="#666" size={32} />
            </div>
          )}
        </motion.div>

      </div>

      {/* Bottom Control Bar */}
      <div style={{ height: '90px', background: 'rgba(0,0,0,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '0 40px' }}>
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
          style={{ padding: '0 30px', height: '50px', borderRadius: '25px', background: '#ff0000', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '20px' }}
        >
          <PhoneOff size={18} />
          End Session
        </button>
      </div>
    </div>
  );
};

export default VirtualCallRoom;
