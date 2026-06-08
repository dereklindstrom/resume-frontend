import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Video, User, Briefcase, Camera, Square, Play, UploadCloud, CheckCircle, RefreshCcw, AlertCircle, Loader2 } from 'lucide-react';

export default function RecommenderPortal() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState(null);

  // Form & Step State
  const [step, setStep] = useState(1); // 1: Details, 2: Record, 3: Review/Upload, 4: Success
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  // Video State
  const videoLiveRef = useRef(null);
  const videoPlaybackRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Fetch & Validate the Link
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const docRef = doc(db, "recommendations", id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          setError("This link is invalid or has expired.");
        } else if (docSnap.data().status !== 'pending') {
          setError("This recommendation has already been submitted. Thank you!");
        } else {
          setRequestData(docSnap.data());
        }
      } catch (err) {
        console.error(err);
        setError("Error loading the request. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  // 2. Camera Controls
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      setStream(mediaStream);
      setStep(2);
      
      // We need a tiny timeout to ensure the video element has rendered before attaching the stream
      setTimeout(() => {
        if (videoLiveRef.current) {
          videoLiveRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      alert("We need camera and microphone access to record the video. Please allow permissions in your browser.");
    }
  };

  const startRecording = () => {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      // Browser usually defaults to webm or mp4 depending on the OS/Browser combination
      const blob = new Blob(chunks, { type: recorder.mimeType });
      setRecordedBlob(blob);
      setPlaybackUrl(URL.createObjectURL(blob));
      setStep(3);
      
      // Stop the live camera light
      stream.getTracks().forEach(track => track.stop());
    };
    
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const retakeVideo = () => {
    setRecordedBlob(null);
    setPlaybackUrl(null);
    startCamera();
  };

  // 3. Upload & Save
  const handleUpload = async () => {
    if (!recordedBlob) return;
    setIsUploading(true);
    
    try {
      // Upload video to Firebase Storage
      const fileExt = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
      const storageRef = ref(storage, `recommendations/${id}.${fileExt}`);
      await uploadBytes(storageRef, recordedBlob);
      const publicUrl = await getDownloadURL(storageRef);

      // Update Firestore Document
      await updateDoc(doc(db, "recommendations", id), {
        status: 'recorded',
        recommenderName: name,
        recommenderTitle: title,
        videoUrl: publicUrl,
        submittedAt: new Date().toISOString()
      });

      setStep(4);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- UI RENDER BLOCKS ---
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc' }}>
        <Loader2 size={48} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', fontWeight: 'bold', fontFamily: 'system-ui' }}>Loading secure portal...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc', padding: '20px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <AlertCircle size={64} color="#f43f5e" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Link Unavailable</h1>
        <p style={{ color: '#94a3b8' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', padding: '12px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #334155' }}>
            <Video size={32} color="#10b981" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>Video Endorsement</h1>
          {step !== 4 && <p style={{ color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>You have been asked to provide a brief video recommendation. This will be featured on their digital ResuME profile.</p>}
        </div>

        {/* STEP 1: Details Form */}
        {step === 1 && (
          <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}><User size={16} /> Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe" style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}><Briefcase size={16} /> Your Job Title & Company</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. VP of Sales at TechCorp" style={{ width: '100%', padding: '12px 16px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            
            <button 
              onClick={startCamera} 
              disabled={!name.trim() || !title.trim()} 
              style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: (!name.trim() || !title.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (!name.trim() || !title.trim()) ? 0.5 : 1 }}
            >
              <Camera size={20} /> Enable Camera
            </button>
          </div>
        )}

        {/* STEP 2: Live Camera & Recording */}
        {step === 2 && (
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <video ref={videoLiveRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              {isRecording && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '20px', color: '#f43f5e', fontWeight: 'bold', fontSize: '13px' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#f43f5e', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} /> REC
                </div>
              )}
            </div>
            
            {!isRecording ? (
              <button onClick={startRecording} style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f43f5e', border: '4px solid #1e293b', outline: '4px solid #f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#fff', borderRadius: '50%' }} />
              </button>
            ) : (
              <button onClick={stopRecording} style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f43f5e', border: '4px solid #1e293b', outline: '4px solid #f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <Square size={24} color="#fff" fill="#fff" />
              </button>
            )}
            <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
          </div>
        )}

        {/* STEP 3: Review & Upload */}
        {step === 3 && (
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ width: '100%', aspectRatio: '9/16', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <video ref={videoPlaybackRef} src={playbackUrl} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button onClick={handleUpload} disabled={isUploading} style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: isUploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isUploading ? <><Loader2 size={20} className="spin-animation" /> Uploading...</> : <><UploadCloud size={20} /> Submit Endorsement</>}
              </button>
              <button onClick={retakeVideo} disabled={isUploading} style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: isUploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RefreshCcw size={20} /> Retake Video
              </button>
            </div>
            <style>{`.spin-animation { animation: spin 1s linear infinite; }`}</style>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center' }}>
            <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px auto' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginBottom: '12px' }}>Upload Complete!</h2>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>Your video endorsement has been securely sent. Thank you for taking the time to record this.</p>
          </div>
        )}

      </div>
    </div>
  );
}