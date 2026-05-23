import { useState, useRef } from 'react';
import { Camera, UploadCloud, ArrowRight, ArrowLeft, Loader2, CheckCircle2, RefreshCcw } from 'lucide-react';
import { storage, auth } from './firebase'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function VideoStep({ onComplete, onBack }) {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🌟 PATH 1: PROFESSIONAL UPLOAD (Firebase Storage)
  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg, image/png, image/webp';

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Maximum size is 5MB.");
        return;
      }

      setIsUploading(true);
      setCameraActive(false); // Turn off camera if it was on

      try {
        // Save to a dedicated "profile" folder
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile/${Date.now()}_headshot`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          null, 
          (error) => {
            console.error("Upload failed:", error);
            alert("Failed to upload image.");
            setIsUploading(false);
          }, 
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setMediaUrl(downloadURL);
            setIsUploading(false);
          }
        );
      } catch (error) {
        console.error("Storage Error:", error);
        setIsUploading(false);
      }
    };

    fileInput.click();
  };

  // 📸 PATH 2: WEBCAM CAPTURE
  const startCamera = async () => {
    setCameraActive(true);
    setMediaUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Could not access your camera. Please check your browser permissions.");
      setCameraActive(false);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 400, 300);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      
      // Stop the camera stream
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      
      setMediaUrl(imageDataUrl);
      setCameraActive(false);
    }
  };

  // 🚀 SUBMIT TO APP STATE
  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      hasMedia: mediaUrl !== null,
      publicUrl: mediaUrl || null, // Forces null instead of undefined
      mediaType: 'image',          // 🌟 Added this to satisfy Firebase!
      shape: 'circle' 
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0' }}>Profile Headshot</h2>
        <p style={{ fontSize: '16px', color: '#64748b' }}>Make your resume stand out. Upload a professional headshot, snap a quick photo, or record a 20 second video introduction.</p>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        
        {/* THE MEDIA DISPLAY AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          
          {isUploading ? (
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed #cbd5e1' }}>
              <Loader2 size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Uploading...</span>
            </div>
          ) : mediaUrl ? (
            <div style={{ position: 'relative' }}>
              <img src={mediaUrl} alt="Profile preview" style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }} />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', padding: '6px', display: 'flex' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
          ) : cameraActive ? (
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block' }} />
              <button onClick={takeSnapshot} style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ef4444', color: 'white', border: '4px solid #ffffff', borderRadius: '50%', width: '60px', height: '60px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                <Camera size={24} />
              </button>
            </div>
          ) : (
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #cbd5e1' }}>
              <Camera size={40} color="#94a3b8" />
            </div>
          )}
          
          <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
        </div>

        {/* THE CONTROLS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '500px', margin: '0 auto' }}>
          
          <button type="button" onClick={handleFileUpload} disabled={isUploading || cameraActive} style={{ padding: '16px', backgroundColor: '#eff6ff', color: '#3b82f6', border: '2px solid #bfdbfe', borderRadius: '12px', fontWeight: 'bold', cursor: isUploading || cameraActive ? 'not-allowed' : 'pointer', fontSize: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: isUploading || cameraActive ? 0.5 : 1, transition: 'all 0.2s' }}>
            <UploadCloud size={24} /> Upload Professional Photo
          </button>

          <button type="button" onClick={mediaUrl || cameraActive ? () => { setMediaUrl(null); setCameraActive(false); } : startCamera} disabled={isUploading} style={{ padding: '16px', backgroundColor: '#f8fafc', color: '#475569', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: isUploading ? 0.5 : 1, transition: 'all 0.2s' }}>
            {mediaUrl || cameraActive ? (
              <><RefreshCcw size={24} /> Retake / Cancel</>
            ) : (
              <><Camera size={24} /> Use Webcam</>
            )}
          </button>

        </div>
      </div>

      {/* --- NAVIGATION BUTTONS --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={onBack} style={{ padding: '14px 28px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <button type="button" onClick={handleSubmit} style={{ padding: '14px 28px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)' }}>
          {mediaUrl ? "Confirm & Continue" : "Skip this Step"} <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}