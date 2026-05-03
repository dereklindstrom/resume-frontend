import { useState, useRef, useEffect } from 'react';

export default function VideoIntro({ accentColor }) {
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isStudioMode, setIsStudioMode] = useState(false);
  const [shape, setShape] = useState('rounded'); 
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Please allow camera and microphone permissions.");
    }
  };

  const startRecording = () => {
    chunksRef.current = [];
    let mediaRecorder;
    
    // 🛡️ THE BLACK SCREEN FIX: We let the browser automatically choose its native encoding format
    try { mediaRecorder = new MediaRecorder(stream); } 
    catch (e) { mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' }); }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      // We explicitly tie the Blob type to whatever the browser native format is
      const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      stopCamera();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const retakeVideo = () => {
    setVideoUrl(null);
    startCamera();
  };

  const getShapeStyles = () => {
    switch(shape) {
      case 'circle': return { width: '220px', height: '220px', borderRadius: '50%' };
      case 'rectangle': return { width: '200px', height: '260px', borderRadius: '4px' };
      case 'rounded': 
      default: return { width: '200px', height: '260px', borderRadius: '16px' };
    }
  };

  // --- THE 3D BUTTON GENERATOR ---
  const get3DButtonStyle = (bgColor) => ({
    padding: '12px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.3)',
    backgroundColor: bgColor,
    // The top-to-bottom gradient creates the rounded 3D illusion
    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.15) 100%)',
    // The double shadow creates the physical "lift" off the page
    boxShadow: '0 5px 0 rgba(0,0,0,0.3), 0 8px 15px rgba(0,0,0,0.2)',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    justifyContent: 'center',
    minWidth: '140px',
    transition: 'all 0.1s ease'
  });

  const activeThemeColor = accentColor || '#38bdf8';

  const containerStyles = {
    position: 'relative', 
    ...getShapeStyles(), 
    overflow: 'hidden', 
    backgroundColor: isStudioMode ? '#1e293b' : '#0f172a', 
    boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
    border: `3px solid ${isRecording ? '#ef4444' : activeThemeColor}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
  };

  const videoStyles = {
    width: '100%', height: '100%', objectFit: 'cover', 
    transform: 'scaleX(-1)', // Mirrors the camera feed
    filter: isStudioMode ? 'contrast(1.1) brightness(1.05) saturate(1.1)' : 'none',
    WebkitMaskImage: isStudioMode ? 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)' : 'none',
    maskImage: isStudioMode ? 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)' : 'none',
    transition: 'all 0.5s ease',
    backgroundColor: '#000'
  };

  // State C: Default Placeholder
  if (!stream && !videoUrl) {
    return (
      <div style={{ ...getShapeStyles(), backgroundColor: 'rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${activeThemeColor}`, padding: '20px', margin: '0 auto' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📹</div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '15px' }}>Video Intro</span>
        <button className="btn-3d" onClick={startCamera} style={get3DButtonStyle(activeThemeColor)}>
          Enable Camera
        </button>
      </div>
    );
  }

  // State A & B: Active Camera or Playback Video
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* 🛡️ DYNAMIC CSS FOR THE BUTTON "CLICK" EFFECT */}
      <style>{`.btn-3d:active { transform: translateY(5px); box-shadow: 0 0px 0 rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.2) !important; }`}</style>
      
      {/* LEFT SIDE: The Video Canvas */}
      <div style={containerStyles}>
        {videoUrl ? (
          // 🛡️ ADDED key={videoUrl} to force React to remount the player, skipping the black frame!
          <video key={videoUrl} src={videoUrl} controls autoPlay playsInline style={{...videoStyles, transform: 'none'}} />
        ) : (
          <video ref={videoRef} autoPlay muted playsInline style={videoStyles} />
        )}
      </div>

      {/* RIGHT SIDE: The 3D Control Desk */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {!videoUrl ? (
          <>
            {/* Design Controls */}
            <button className="btn-3d" onClick={() => setIsStudioMode(!isStudioMode)} style={get3DButtonStyle(isStudioMode ? activeThemeColor : '#334155')}>
              ✨ {isStudioMode ? 'Studio: ON' : 'Studio: OFF'}
            </button>
            
            {!isRecording && (
              <button className="btn-3d" onClick={() => setShape(shape === 'rounded' ? 'circle' : shape === 'circle' ? 'rectangle' : 'rounded')} style={get3DButtonStyle('#475569')}>
                ⛶ Shape: {shape.charAt(0).toUpperCase() + shape.slice(1)}
              </button>
            )}

            {/* Action Controls */}
            {!isRecording ? (
              <button className="btn-3d" onClick={startRecording} style={get3DButtonStyle('#ef4444')}>
                🔴 Start Record
              </button>
            ) : (
              <button className="btn-3d" onClick={stopRecording} style={get3DButtonStyle('#f59e0b')}>
                ⏹️ Stop Record
              </button>
            )}
          </>
        ) : (
          /* Playback Controls */
          <button className="btn-3d" onClick={retakeVideo} style={get3DButtonStyle('#334155')}>
            ↺ Retake Video
          </button>
        )}
      </div>
    </div>
  );
}