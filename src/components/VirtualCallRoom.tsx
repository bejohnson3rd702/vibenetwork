import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { getSafeUserMedia } from '../lib/mediaUtils';
import { supabase } from '../supabaseClient';

const VirtualCallRoom: React.FC = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [peerId, setPeerId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const myStream = useRef<MediaStream | null>(null);

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const searchParams = new URLSearchParams(window.location.search);
  const isAudioCall = searchParams.get('type') === 'audio' || bookingDetails?.meeting_type?.includes('audio');

  const startRecording = (local: MediaStream, remote: MediaStream) => {
    if (!bookingDetails?.record_call) {
      console.log("Call recording not requested for this booking. Skipping.");
      return;
    }
    if (mediaRecorderRef.current) return;

    console.log("Starting WebRTC call recording...");
    recordedChunks.current = [];

    const mixedStream = new MediaStream();
    local.getTracks().forEach(track => mixedStream.addTrack(track));
    remote.getTracks().forEach(track => mixedStream.addTrack(track));

    try {
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const recorder = new MediaRecorder(mixedStream, options);
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        console.log("Recording stopped. Preparing file upload...");
        setIsRecording(false);
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        
        const fileName = `${callId}_recording.webm`;
        try {
          const { error: uploadError } = await supabase.storage
            .from('call-recordings')
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error("Storage upload failed:", uploadError.message);
            return;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('call-recordings')
            .getPublicUrl(fileName);

          const { error: dbError } = await supabase
            .from('bookings')
            .update({ recording_url: publicUrl })
            .eq('id', callId);

          if (dbError) {
            console.error("Failed to save recording link in database:", dbError.message);
          } else {
            console.log("Call recording uploaded and saved successfully! Link:", publicUrl);
          }
        } catch (e: any) {
          console.error("Failed to process recording upload:", e);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.warn("MimeType not supported, falling back to default MediaRecorder options:", err);
      try {
        const recorder = new MediaRecorder(mixedStream);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunks.current.push(event.data);
          }
        };
        recorder.onstop = async () => {
          setIsRecording(false);
          const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
          const fileName = `${callId}_recording.webm`;
          const { error: uploadError } = await supabase.storage
            .from('call-recordings')
            .upload(fileName, blob, { upsert: true });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('call-recordings').getPublicUrl(fileName);
            await supabase.from('bookings').update({ recording_url: publicUrl }).eq('id', callId);
          }
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (e) {
        console.error("MediaRecorder failed to initialize:", e);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  useEffect(() => {
    // 1. Fetch booking details to check if record_call is enabled
    if (callId && supabase) {
      supabase.from('bookings')
        .select('*')
        .eq('id', callId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setBookingDetails(data);
        });
    }

    // 2. Initialize WebRTC Peer
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    // Request camera/mic permissions securely (disabling video if isAudioCall is true)
    getSafeUserMedia(!isAudioCall, true)
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
            if (stream) {
              startRecording(stream, remoteStream);
            }
          });
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
        toast.error("Camera or Microphone access denied. Please allow permissions to join the call.");
      });

    peerInstance.current = peer;

    return () => {
      // Cleanup on unmount
      stopRecording();
      if (myStream.current) {
        myStream.current.getTracks().forEach(track => track.stop());
      }
      peer.destroy();
    };
  }, [bookingDetails?.record_call]);

  const handleCall = () => {
    if (!targetId || !peerInstance.current || !myStream.current) return;
    
    const call = peerInstance.current.call(targetId, myStream.current);
    setIsConnected(true);
    
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      if (myStream.current) {
        startRecording(myStream.current, remoteStream);
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
    stopRecording();
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
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, letterSpacing: '1px' }}>
            Vibe 1-on-1 {isAudioCall ? 'Audio' : 'Video'} Session
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isRecording && (
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,0,0,0.15)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 14px', borderRadius: '14px', fontSize: '13px', fontWeight: 'bold' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d4d' }} />
              REC
            </motion.div>
          )}

          {!isConnected && (
            <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '14px', color: '#ccc' }}>
               Waiting for partner...
            </div>
          )}
        </div>
      </div>

      {/* Main Call View */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {isAudioCall ? (
          /* --- AUDIO ONLY INTERFACE --- */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(20,20,30,0.8) 0%, rgba(5,5,10,1) 100%)' }}>
            {!isConnected ? (
              /* Waiting / Join Prompt */
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '440px', margin: '20px' }}>
                <div style={{ fontSize: '48px' }}>🎧</div>
                <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '22px' }}>Waiting for connection...</h2>
                
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Your Audio Connection ID:</span>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#00ff88', letterSpacing: '1px', background: 'rgba(0,255,136,0.08)', padding: '12px', borderRadius: '8px', marginBottom: '20px', wordBreak: 'break-all', userSelect: 'all', border: '1px dashed rgba(0,255,136,0.3)' }}>
                    {peerId || 'Generating...'}
                  </div>
                  
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Enter Partner's ID to Connect:</span>
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
                      style={{ padding: '14px 24px', background: targetId ? '#00ff88' : '#444', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: targetId ? 'pointer' : 'not-allowed', transition: '0.2s' }}
                      onMouseOver={e=>{if(targetId)e.currentTarget.style.background='#00cc6c'}} onMouseOut={e=>{if(targetId)e.currentTarget.style.background='#00ff88'}}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Live Audio Call Screen */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Pulsing Active Ring */}
                  {!isAudioMuted && (
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(0, 255, 136, 0.12)', border: '2px solid #00ff88' }}
                    />
                  )}
                  {/* Central Avatar */}
                  <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '3px solid rgba(255,255,255,0.1)', zIndex: 1 }}>
                    {bookingDetails?.guest_name?.charAt(0) || '🎙️'}
                  </div>
                </div>
                
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#fff' }}>
                    {bookingDetails?.guest_name || 'Active Guest'}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>
                    1-on-1 Secure Audio Call
                  </p>
                </div>

                {/* Voice wave micro-animation */}
                {!isAudioMuted && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '40px', marginTop: '10px' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                      <motion.div
                        key={bar}
                        animate={{ height: [10, Math.random() * 35 + 10, 10] }}
                        transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.4, ease: "easeInOut" }}
                        style={{ width: '4px', background: '#00ff88', borderRadius: '2px' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Audio streams (hidden in UI but playing audio) */}
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              style={{ display: 'none' }} 
            />
          </div>
        ) : (
          /* --- VIDEO CALL INTERFACE --- */
          <>
            {/* Remote Video (Full Screen) */}
            <div style={{ flex: 1, background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!isConnected && (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>📹</div>
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
                muted 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
              />
              {isVideoMuted && (
                <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VideoOff color="#666" size={32} />
                </div>
              )}
            </motion.div>
          </>
        )}

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

        {!isAudioCall && (
          <button 
            onClick={toggleVideo}
            style={{ width: '50px', height: '50px', borderRadius: '50%', background: isVideoMuted ? '#ff4d4d' : 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}
          >
            {isVideoMuted ? <VideoOff color="#fff" /> : <Video color="#fff" />}
          </button>
        )}

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
