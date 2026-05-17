import { useState } from 'react';
import { Briefcase, GraduationCap, Plus, Trash2, ArrowRight, ArrowLeft, Image as ImageIcon, Video, Lock, Loader2 } from 'lucide-react';
import { storage, auth } from './firebase'; // Make sure this path is correct!
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// 🌟 1. Added subscriptionTier to props
export default function ExperienceDetails({ level, savedData, onComplete, onBack, subscriptionTier = 'free' }) {
  const [workHistory, setWorkHistory] = useState(
    savedData?.workHistory || [{ company: '', title: '', dates: '', description: '', media: [] }]
  );
  
  const [eduDetails, setEduDetails] = useState(
    savedData?.eduDetails || [{ school: '', degree: '', year: '' }]
  );

  const [isUploading, setIsUploading] = useState(false);

  // 🌟 THE LIMIT ENGINE
  const getMaxMedia = () => {
    if (subscriptionTier === 'executive') return 10;
    if (subscriptionTier === 'pro') return 5;
    if (subscriptionTier === 'basic') return 3;
    return 0; // Free
  };
  
  const canUploadVideo = subscriptionTier === 'executive';
  const maxMedia = getMaxMedia();

  // --- WORK HISTORY HANDLERS ---
  const handleWorkChange = (index, field, value) => {
    const updatedHistory = [...workHistory];
    updatedHistory[index][field] = value;
    setWorkHistory(updatedHistory);
  };

  const addJob = () => {
    setWorkHistory([...workHistory, { company: '', title: '', dates: '', description: '', media: [] }]);
  };

  const removeJob = (index) => {
    setWorkHistory(workHistory.filter((_, i) => i !== index));
  };

  // 🌟 MEDIA HANDLERS
  // 🌟 REAL FIREBASE MEDIA UPLOAD
  const handleAddMedia = (index, type) => {
    const job = workHistory[index];
    const currentMediaCount = job.media?.length || 0;

    if (currentMediaCount >= maxMedia) {
      alert(`🌟 Your current tier limits you to ${maxMedia} media items per job. Upgrade to add more!`);
      return;
    }

    if (type === 'video' && !canUploadVideo) {
      alert("🌟 Video uploads are an Executive Tier exclusive. Upgrade to stand out with video!");
      return;
    }

    // 1. Create an invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'image' ? 'image/jpeg, image/png, image/webp' : 'video/mp4, video/webm';

    // 2. Listen for the user to select a file
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Basic size limit check (e.g., 5MB for images, 50MB for video)
      const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File is too large! Maximum size is ${type === 'image' ? '5MB' : '50MB'}.`);
        return;
      }

      setIsUploading(true);

      try {
        // 3. Create a secure path in Firebase Storage: users/{uid}/portfolio/{timestamp_filename}
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/portfolio/${Date.now()}_${file.name}`);
        
        // 4. Start the upload
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            // You could track upload progress here if you wanted a progress bar
          }, 
          (error) => {
            console.error("Upload failed:", error);
            alert("Failed to upload file. Check your Firebase Storage rules.");
            setIsUploading(false);
          }, 
          async () => {
            // 5. Success! Get the public URL and save it to the resume state
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const updatedHistory = [...workHistory];
            const newMedia = job.media || [];
            updatedHistory[index].media = [...newMedia, { type, name: file.name, url: downloadURL }];
            setWorkHistory(updatedHistory);
            
            setIsUploading(false);
          }
        );
      } catch (error) {
        console.error("Storage Error:", error);
        setIsUploading(false);
      }
    };

    // Trigger the file browser to open
    fileInput.click();
  };

  const removeMedia = (jobIndex, mediaIndex) => {
    const updatedHistory = [...workHistory];
    updatedHistory[jobIndex].media.splice(mediaIndex, 1);
    setWorkHistory(updatedHistory);
  };

  // --- EDUCATION HANDLERS ---
  const handleEduChange = (index, field, value) => {
    const updatedEdu = [...eduDetails];
    updatedEdu[index][field] = value;
    setEduDetails(updatedEdu);
  };

  const addEducation = () => setEduDetails([...eduDetails, { school: '', degree: '', year: '' }]);
  const removeEducation = (index) => setEduDetails(eduDetails.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ showEdu: eduDetails.length > 0 && eduDetails[0].school !== '', workHistory, eduDetails });
  };

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0' }}>Experience & Education</h2>
        <p style={{ fontSize: '16px', color: '#64748b' }}>Let's detail your background. Don't worry about perfect formatting—our AI will polish it for you.</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* --- WORK HISTORY SECTION --- */}
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={24} color="#3b82f6" /> Professional Experience
          </h3>

          {workHistory.map((job, index) => (
            <div key={index} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px', position: 'relative' }}>
              
              {workHistory.length > 1 && (
                <button type="button" onClick={() => removeJob(index)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Job Title</label>
                  <input type="text" required style={inputStyle} placeholder="e.g. Senior Manager" value={job.title} onChange={(e) => handleWorkChange(index, 'title', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input type="text" required style={inputStyle} placeholder="e.g. Google" value={job.company} onChange={(e) => handleWorkChange(index, 'company', e.target.value)} />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Dates of Employment</label>
                <input type="text" required style={inputStyle} placeholder="e.g. March 2021 - Present" value={job.dates} onChange={(e) => handleWorkChange(index, 'dates', e.target.value)} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Key Responsibilities & Achievements</label>
                <textarea required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Briefly describe what you did here. Bullet points are fine!" value={job.description} onChange={(e) => handleWorkChange(index, 'description', e.target.value)} />
              </div>

              {/* 🌟 NEW: THE MEDIA UPLOAD PAYWALL SECTION */}
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Accomplishment Media ({job.media?.length || 0}/{maxMedia})</span>
                </div>
                
                {/* Simulated Media Previews */}
                {job.media && job.media.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {job.media.map((m, mIdx) => (
                      <div key={mIdx} style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {m.type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />} {m.name}
                        <button type="button" onClick={() => removeMedia(index, mIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0', marginLeft: '4px' }}><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Buttons */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="button" onClick={() => handleAddMedia(index, 'image')} disabled={isUploading} style={{ padding: '8px 16px', backgroundColor: maxMedia === 0 ? '#f1f5f9' : '#eff6ff', color: maxMedia === 0 ? '#94a3b8' : '#3b82f6', border: maxMedia === 0 ? '1px solid #e2e8f0' : '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: isUploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: isUploading ? 0.5 : 1 }}>
                    <ImageIcon size={16} /> Add Image {maxMedia === 0 && <Lock size={12} />}
                  </button>
                  
                  <button type="button" onClick={() => handleAddMedia(index, 'video')} disabled={isUploading} style={{ padding: '8px 16px', backgroundColor: canUploadVideo ? '#f5f3ff' : '#f1f5f9', color: canUploadVideo ? '#8b5cf6' : '#94a3b8', border: canUploadVideo ? '1px solid #ddd6fe' : '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: isUploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: isUploading ? 0.5 : 1 }}>
                    <Video size={16} /> Add Video {!canUploadVideo && <Lock size={12} />}
                  </button>

                  {isUploading && <Loader2 size={16} color="#64748b" style={{ animation: 'spin 1s linear infinite' }} />}
                </div>
              </div>

            </div>
          ))}

          <button type="button" onClick={addJob} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', background: 'none', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', padding: '0' }}>
            <Plus size={18} /> Add Another Role
          </button>
        </div>

        {/* ... (Education Section and Nav Buttons remain exactly the same) ... */}
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={24} color="#8b5cf6" /> Education & Certifications
          </h3>

          {eduDetails.map((edu, index) => (
            <div key={index} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px', position: 'relative' }}>
              {eduDetails.length > 1 && (
                <button type="button" onClick={() => removeEducation(index)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Degree / Certification</label>
                  <input type="text" style={inputStyle} placeholder="e.g. B.S. Computer Science" value={edu.degree} onChange={(e) => handleEduChange(index, 'degree', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>School / Institution</label>
                  <input type="text" style={inputStyle} placeholder="e.g. Stanford University" value={edu.school} onChange={(e) => handleEduChange(index, 'school', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addEducation} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', background: 'none', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', padding: '0' }}>
            <Plus size={18} /> Add Another Degree
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={onBack} style={{ padding: '14px 28px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Back
          </button>
          <button type="submit" style={{ padding: '14px 28px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)' }}>
            Next Step <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}