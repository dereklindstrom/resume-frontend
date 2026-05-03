import { useState, useRef } from 'react';

export default function VideoStep({ savedData, onComplete, onBack }) {
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(savedData?.videoUrl || null);
  const [photoUrl, setPhotoUrl] = useState(savedData?.photoUrl || null);
  const [isStudioMode, setIsStudioMode] = useState(savedData?.isStudioMode || false);
  const [shape, setShape] = useState(savedData?.shape || 'rounded'); 
  const [countdown, setCountdown] = useState(null);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const canvasRef = useRef(null);
  const chunksRef = useRef([]);

  const handleVideoMount = (element) => {
    videoRef.current = element;
    if (element && stream) {
      element.srcObject = stream;
      element.onloadedmetadata = () => { element.play().catch(e => console.error(e)); };
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
    } catch (error) { alert("Please allow camera permissions to record an intro."); }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhotoUrl(canvas.toDataURL('image/jpeg', 0.9));
      setVideoUrl(null);
      stopCamera();
    }
  };

  const initiateRecording = () => {
    setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) setCountdown(count);
      else { clearInterval(timer); setCountdown(null); actualStartRecording(); }
    }, 1000);
  };

  const actualStartRecording = () => {
    chunksRef.current = [];
    let mediaRecorder;
    try { mediaRecorder = new MediaRecorder(stream); } catch (e) { mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' }); }
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
      setPhotoUrl(null);
      stopCamera();
    };
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); };
  const stopCamera = () => { if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); } };

  const getShapeStyles = () => {
    switch(shape) {
      case 'circle': return { width: '240px', height: '240px', borderRadius: '50%' };
      case 'rectangle': return { width: '220px', height: '300px', borderRadius: '4px' };
      default: return { width: '220px', height: '300px', borderRadius: '16px' };
    }
  };

  // 🎨 MASTER BLUE-GRAY DESIGN SYSTEM
  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#0f172a' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)' },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { fontSize: '16px', color: '#64748b', margin: '0' },
    
    cameraBox: { backgroundColor: '#f8fafc', padding: '32px', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', transition: 'all 0.3s ease' },
    
    // Modern button styles
    controlsContainer: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' },
    iconBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease' },
    
    btnPrimary: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' },
    btnSecondary: { backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1' },
    btnRecord: { backgroundColor: '#ef4444', color: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' },
    btnStop: { backgroundColor: '#1e293b', color: '#fff', border: 'none' },

    // Bottom Navigation
    buttonContainer: { display: 'flex', gap: '16px', marginTop: '32px' },
    navSecondary: { flex: 1, padding: '16px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', color: '#475569', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s ease' },
    navPrimary: { flex: 1, padding: '16px', backgroundColor: '#10b981', border: 'none', color: '#ffffff', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', transition: 'all 0.2s ease' },
    navDisabled: { flex: 1, padding: '16px', backgroundColor: '#e2e8f0', border: 'none', color: '#94a3b8', fontWeight: '600', borderRadius: '12px', cursor: 'not-allowed', fontSize: '16px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Define Your Profile Header</h2>
          <p style={styles.subtitle}>Let’s find the perfect element for your name. You can use a video intro, a professional photo, or keep it text-only.</p>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={styles.cameraBox}>
          
          <div style={{ position: 'relative', ...getShapeStyles(), backgroundColor: isStudioMode ? '#1e293b' : '#000', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: `3px solid ${isRecording ? '#ef4444' : '#ffffff'}`, transition: 'all 0.3s ease' }}>
            
            {!stream && !videoUrl && !photoUrl && (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', color: '#94a3b8' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            )}

            {stream && <video ref={handleVideoMount} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', filter: isStudioMode ? 'contrast(1.1) brightness(1.05)' : 'none' }} />}
            {videoUrl && <video key={videoUrl} src={videoUrl} controls autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            {photoUrl && <img src={photoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isStudioMode ? 'contrast(1.1) brightness(1.05)' : 'none' }} />}
            
            {countdown !== null && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '80px', fontWeight: 'bold', zIndex: 100 }}>
                {countdown}
              </div>
            )}
          </div>

          <div style={styles.controlsContainer}>
            {!stream && !videoUrl && !photoUrl && (
              <button onClick={startCamera} style={{...styles.iconBtn, ...styles.btnPrimary}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Enable Camera
              </button>
            )}
            
            {stream && (
              <>
                <button onClick={() => setIsStudioMode(!isStudioMode)} style={{...styles.iconBtn, ...styles.btnSecondary}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isStudioMode ? "#3b82f6" : "currentColor"} strokeWidth="2"><path d="M12 3v18M3 12h18M18.36 5.64l-12.73 12.73M5.64 5.64l12.73 12.73"/></svg>
                  {isStudioMode ? 'Studio: ON' : 'Studio: OFF'}
                </button>
                
                {!isRecording && countdown === null && (
                  <button onClick={() => setShape(shape === 'rounded' ? 'circle' : shape === 'circle' ? 'rectangle' : 'rounded')} style={{...styles.iconBtn, ...styles.btnSecondary}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                    Shape
                  </button>
                )}
                
                {!isRecording && countdown === null && (
                  <button onClick={takePhoto} style={{...styles.iconBtn, ...styles.btnPrimary}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                    Snap Photo
                  </button>
                )}
                
                {!isRecording && countdown === null && (
                  <button onClick={initiateRecording} style={{...styles.iconBtn, ...styles.btnRecord}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                    Record Video
                  </button>
                )}
                
                {isRecording && (
                  <button onClick={stopRecording} style={{...styles.iconBtn, ...styles.btnStop}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12"/></svg>
                    Stop
                  </button>
                )}
              </>
            )}

            {(videoUrl || photoUrl) && (
              <button onClick={() => { setVideoUrl(null); setPhotoUrl(null); startCamera(); }} style={{...styles.iconBtn, ...styles.btnSecondary}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Retake
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div style={styles.buttonContainer}>
          <button 
            onClick={() => onBack({ videoUrl, photoUrl, shape, isStudioMode })} 
            style={styles.navSecondary}
          >
            Back
          </button>
          
          <button 
            onClick={() => onComplete({ hasMedia: false, mediaType: 'none' })} 
            style={styles.navSecondary}
          >
            Skip / Text Only
          </button>
          
          <button 
            onClick={() => {
                if (videoUrl) onComplete({ hasMedia: true, mediaType: 'video', videoUrl, photoUrl: null, shape, isStudioMode });
                else if (photoUrl) onComplete({ hasMedia: true, mediaType: 'photo', videoUrl: null, photoUrl, shape, isStudioMode });
            }}
            disabled={!videoUrl && !photoUrl}
            style={(videoUrl || photoUrl) ? styles.navPrimary : styles.navDisabled}
          >
            Generate Profile ✨
          </button>
        </div>

      </div>
    </div>
  );
}