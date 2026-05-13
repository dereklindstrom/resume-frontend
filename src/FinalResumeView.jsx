import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Target, Briefcase, GraduationCap, PlayCircle, Pencil, RefreshCw, Download, RotateCcw, LayoutDashboard, LayoutTemplate, Palette, Save, FileText, BrainCircuit, TrendingUp, AlertCircle, UploadCloud, CheckCircle, LogOut, Lock } from 'lucide-react'; // 🌟 Added Lock icon
import { useNavigate } from 'react-router-dom';

import { db, storage, auth } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';

// 🌟 Added isPremium to the props
export default function FinalResumeView({ resumeText, userData, editId, onReset, onRegenerate, isGenerating, isPublicView = false, isPremium = false }) {
  const [activeView, setActiveView] = useState('resume'); 
  const [layout, setLayout] = useState('signature'); 
  const [palette, setPalette] = useState('cobalt');
  const navigate = useNavigate();
  
  const [editableData, setEditableData] = useState({ 
    summary: "Loading profile...", skills: [], experience: [], education: {}, 
    coaching: { suggestedRoles: ["Loading..."], skillGaps: [] } 
  });

  // 🌟 Define layout options and their premium status
  const layoutOptions = [
    { id: 'signature', name: 'Signature', isPremiumOnly: false },
    { id: 'startup', name: 'Startup', isPremiumOnly: true },
    { id: 'executive', name: 'Executive', isPremiumOnly: true }
  ];

  useEffect(() => {
    if (!resumeText) return;
    let dataToDraw = null;
    try {
      if (typeof resumeText === 'object') {
        dataToDraw = resumeText; 
      } else if (typeof resumeText === 'string') {
        const startIndex = resumeText.indexOf('{');
        const endIndex = resumeText.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
          dataToDraw = JSON.parse(resumeText.substring(startIndex, endIndex + 1)); 
        }
      }
    } catch (e) {
      console.error("Error formatting data:", e);
    }

    if (dataToDraw) {
      if (!dataToDraw.coaching) dataToDraw.coaching = { suggestedRoles: ["Processing..."], skillGaps: [] };
      setEditableData(dataToDraw);
    }
  }, [resumeText]);

  const [isEditingText, setIsEditingText] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printStream, setPrintStream] = useState(null);
  const [printPhotoUrl, setPrintPhotoUrl] = useState(null);
  const [pdfAction, setPdfAction] = useState(null); 
  const printVideoRef = useRef(null);
  const printCanvasRef = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishId, setPublishId] = useState(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  useEffect(() => {
    if (!resumeText) return;
    let parsed = { summary: "", skills: [], experience: [], education: {}, coaching: { suggestedRoles: [], skillGaps: [] } };
    try {
      if (typeof resumeText === 'string') {
        const startIndex = resumeText.indexOf('{');
        const endIndex = resumeText.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
          parsed = JSON.parse(resumeText.substring(startIndex, endIndex + 1));
        }
      } else if (typeof resumeText === 'object') {
        parsed = JSON.parse(JSON.stringify(resumeText));
      }
    } catch (e) {}
    
    if (!parsed.coaching) parsed.coaching = { suggestedRoles: ["Data Processing..."], skillGaps: [] };
    setEditableData(parsed);
  }, [resumeText]);

  const { name = "Derek Lindstrom", email = "email@example.com", phone = "(555) 555-5555" } = userData?.baseline || {};
  const targetRole = userData?.objective?.targetRole || "Professional Resume";
  const showEdu = userData?.experienceDetails?.showEdu || false;
  
  const staticEducation = Array.isArray(userData?.experienceDetails?.eduDetails) 
    ? userData.experienceDetails.eduDetails 
    : [];
    
  const media = userData?.media || { hasMedia: false, mediaType: 'none' };

  const palettes = { cobalt: { primary: '#1e3a8a', accent: '#3b82f6', bg: '#ffffff', sidebar: '#f8fafc', text: '#334155' }, sage: { primary: '#2f3e46', accent: '#52796f', bg: '#ffffff', sidebar: '#cad2c5', text: '#354f52' }, terracotta: { primary: '#780000', accent: '#c1121f', bg: '#fffdf7', sidebar: '#fdf0d5', text: '#333333' }, midnight: { primary: '#f8fafc', accent: '#38bdf8', bg: '#0f172a', sidebar: '#1e293b', text: '#cbd5e1' }, monochrome: { primary: '#171717', accent: '#737373', bg: '#ffffff', sidebar: '#fafafa', text: '#404040' } };
  const activeColors = palettes[palette];
  const typography = { signature: { font: '"Plus Jakarta Sans", sans-serif', nameWeight: 800, headingStyle: 'uppercase' }, startup: { font: '"Outfit", sans-serif', nameWeight: 600, headingStyle: 'capitalize' }, executive: { font: '"Playfair Display", serif', nameWeight: 700, headingStyle: 'uppercase' } };
  const activeTypo = typography[layout] || typography.signature;

  const updateExperience = (index, field, value) => { const newExp = [...editableData.experience]; newExp[index][field] = value; setEditableData({ ...editableData, experience: newExp }); };
  const updateMetric = (jobIndex, metricIndex, value) => { const newExp = [...editableData.experience]; newExp[jobIndex].metrics[metricIndex] = value; setEditableData({ ...editableData, experience: newExp }); };
  const updateSkill = (index, value) => { const newSkills = [...editableData.skills]; newSkills[index] = value; setEditableData({ ...editableData, skills: newSkills }); };

  const handlePrintRequest = () => { setIsEditingText(false); if (activeView !== 'resume') setActiveView('resume'); setTimeout(() => { if (media.mediaType === 'video' && !pdfAction) setShowPrintModal(true); else window.print(); }, 100); };
  const startPrintCamera = async () => { try { setPrintStream(await navigator.mediaDevices.getUserMedia({ video: true })); } catch (error) { alert("Camera access needed."); } };
  const handlePrintVideoMount = (element) => { printVideoRef.current = element; if (element && printStream) { element.srcObject = printStream; element.onloadedmetadata = () => { element.play().catch(e => console.error(e)); }; } };
  const takePrintPhoto = () => { if (printVideoRef.current && printCanvasRef.current) { const video = printVideoRef.current; const canvas = printCanvasRef.current; canvas.width = video.videoWidth; canvas.height = video.videoHeight; const ctx = canvas.getContext('2d'); ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, canvas.width, canvas.height); setPrintPhotoUrl(canvas.toDataURL('image/jpeg', 0.9)); if (printStream) printStream.getTracks().forEach(t => t.stop()); setPrintStream(null); setPdfAction('photo'); setShowPrintModal(false); setTimeout(() => window.print(), 100); } };
  const skipPrintPhoto = () => { if (printStream) printStream.getTracks().forEach(t => t.stop()); setPrintStream(null); setPdfAction('remove'); setShowPrintModal(false); setTimeout(() => window.print(), 100); };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      let publicMediaUrl = null;
      const activeMediaUrl = printPhotoUrl || media.videoUrl || media.photoUrl;

      if (activeMediaUrl) {
        const response = await fetch(activeMediaUrl);
        const blob = await response.blob();
        const fileRef = ref(storage, `media/${Date.now()}-profile`);
        await uploadBytes(fileRef, blob);
        publicMediaUrl = await getDownloadURL(fileRef);
      }

      const docRef = await addDoc(collection(db, "resumes"), {
        userId: auth.currentUser.uid,
        profileData: editableData,
        userData: {
            baseline: userData.baseline,
            objective: userData.objective,
            experienceDetails: userData.experienceDetails
        },
        design: { layout, palette },
        media: {
           hasMedia: !!activeMediaUrl || media.hasMedia,
           mediaType: printPhotoUrl ? 'photo' : media.mediaType,
           shape: media.shape || 'circle',
           publicUrl: publicMediaUrl 
        },
        createdAt: new Date().toISOString()
      });

      setPublishId(docRef.id);
    } catch (error) {
      console.error("Error publishing to Firebase:", error);
      alert("Failed to publish. Check the console for details.");
    }
    setIsPublishing(false);
  };

  const inputStyle = { width: '100%', background: isEditingText ? 'rgba(56, 189, 248, 0.1)' : 'transparent', border: isEditingText ? '1px dashed #38bdf8' : 'none', borderRadius: '4px', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', padding: isEditingText ? '4px 8px' : '0', outline: 'none', resize: 'vertical', boxSizing: 'border-box' };

  const RenderMedia = () => {
    if (!media.hasMedia || media.mediaType === 'none') return null;
    const width = media.shape === 'circle' ? '180px' : '160px'; 
    const height = media.shape === 'rectangle' ? '220px' : '180px'; 
    const borderRadius = media.shape === 'circle' ? '50%' : media.shape === 'rectangle' ? '4px' : '16px';
    return (
      <div className={`video-module-print-hide ${pdfAction === 'remove' ? 'pdf-remove-shape' : ''}`} style={{ textAlign: 'center', marginBottom: layout === 'startup' ? '0' : '40px', position: 'relative', display: 'inline-block' }}>
        <div style={{ position: 'relative', width, height, borderRadius, overflow: 'hidden', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: '#000', border: `3px solid var(--accent)`, zIndex: 1 }}>
          {media.mediaType === 'video' && <video className="web-video" src={media.videoUrl || media.publicUrl} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          {(printPhotoUrl || media.mediaType === 'photo') && <img className={media.mediaType === 'video' ? "print-photo" : ""} src={printPhotoUrl || media.photoUrl || media.publicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
          .resume-container { --primary: ${activeColors.primary}; --accent: ${activeColors.accent}; --bg: ${activeColors.bg}; --sidebar: ${activeColors.sidebar}; --text: ${activeColors.text}; --font: ${activeTypo.font}; font-family: var(--font); background: var(--bg); color: var(--text); border-radius: 0 0 16px 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); min-height: 850px; display: flex; flex-direction: column; }
          .resume-container h1, .resume-container h2, .resume-container h3, .resume-container h4, .resume-container p { margin: 0; }
          .sidebar-rail { background: var(--sidebar); padding: 50px 40px; border-right: 1px solid rgba(0,0,0,0.05); } .main-content { padding: 60px; flex: 1; text-align: left; }
          .layout-signature { flex-direction: row; } .layout-signature .sidebar-rail { flex: 0 0 320px; max-width: 320px; } .layout-signature .main-content { flex: 1; max-width: none; }
          .layout-startup { flex-direction: column; } .layout-startup .sidebar-rail { display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; border-right: none; border-bottom: 1px solid rgba(0,0,0,0.05); padding: 40px 60px; }
          .layout-executive .main-content { max-width: 850px; margin: 0 auto; text-align: center; } .layout-executive .experience-header { flex-direction: column; align-items: center; } .layout-executive .metrics-toggle summary { justify-content: center; } .layout-executive .metrics-list { list-style-position: inside; }
          .name-header { font-size: clamp(36px, 5vw, 56px); font-weight: ${activeTypo.nameWeight}; color: var(--primary); letter-spacing: -1px; margin-bottom: 12px !important; line-height: 1.1; }
          .title-header { font-size: 18px; color: var(--accent); text-transform: ${activeTypo.headingStyle}; letter-spacing: 3px; font-weight: 600; margin-bottom: 30px !important; display: block; }
          .section-title { font-size: 14px; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px !important; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 12px; display: flex; alignItems: center; gap: 8px; }
          .skills-container { display: flex; flex-wrap: wrap; gap: 10px; } .layout-executive .skills-container { justify-content: center; }
          .skill-tag { padding: 8px 16px; background: rgba(0,0,0,0.04); color: var(--primary); border-radius: 30px; font-size: 13px; font-weight: 600; border: 1px solid rgba(0,0,0,0.05); } .layout-signature .skill-tag { background: transparent; padding: 0; border: none; font-size: 14px; width: 100%; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px; border-radius: 0; }
          .job-item { margin-bottom: 40px; } .experience-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
          .metrics-toggle { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 16px; transition: all 0.3s ease; } .metrics-toggle summary { cursor: pointer; font-size: 13px; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; list-style: none; outline: none; } .metrics-toggle summary::-webkit-details-marker { display: none; } .metrics-list { margin: 12px 0 0 0; padding-left: 24px; font-size: 14.5px; line-height: 1.8; color: var(--text); }
          
          @media print {
            @page { size: letter portrait; margin: 0; } body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .no-print { display: none !important; }
            .resume-container { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; padding: 0.4in 0.5in !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; min-height: 100vh !important; }
            .layout-signature { display: grid !important; grid-template-columns: 200px 1fr !important; gap: 20px !important; } .sidebar-rail, .main-content { padding: 0 !important; background: transparent !important; border: none !important; }
            .name-header { font-size: 28pt !important; margin-bottom: 2px !important; line-height: 1 !important; } .title-header { font-size: 12pt !important; margin-bottom: 12px !important; } .section-title { font-size: 10pt !important; margin-bottom: 8px !important; padding-bottom: 4px !important; }
            p, span, li, .metrics-list { font-size: 9.5pt !important; line-height: 1.3 !important; }
            .job-item { margin-bottom: 12px !important; page-break-inside: avoid !important; break-inside: avoid !important; } .experience-header { margin-bottom: 2px !important; } .experience-header h4 { font-size: 11pt !important; }
            .metrics-toggle summary { display: none !important; } .metrics-toggle { background: transparent !important; border: none !important; padding: 0 !important; } .metrics-list { display: block !important; margin-top: 4px !important; padding-left: 15px !important; }
            h1, h2, h3, h4 { page-break-after: avoid !important; break-after: avoid !important; } .web-video { display: none !important; } .print-photo { display: block !important; } .pdf-remove-shape { display: none !important; }
            .video-module-print-hide > div { width: 120px !important; height: 120px !important; border-width: 2px !important; } input, textarea { border: none !important; background: transparent !important; resize: none !important; padding: 0 !important; }
          }
          @media screen { .print-photo { display: none !important; } .web-video { display: block !important; } }
        `}
      </style>

      {/* 🖨️ PRINT MODAL */}
      {showPrintModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', maxWidth: '450px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', fontFamily: 'system-ui' }}>
            <h2 style={{ color: '#1e3a8a', margin: '0 0 10px 0' }}>Prepare for Print</h2>
            <p style={{ color: '#475569', fontSize: '15px', marginBottom: '25px', lineHeight: '1.5' }}>Your profile features a web video. For the PDF export, would you like to take a professional photo, or remove the picture entirely?</p>
            <canvas ref={printCanvasRef} style={{ display: 'none' }} />
            {printStream ? (
              <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 20px auto', border: '3px solid #3b82f6' }}>
                <video ref={handlePrintVideoMount} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              </div>
            ) : (
              <button onClick={startPrintCamera} style={{ padding: '12px 24px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>📸 Enable Camera for Photo</button>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {printStream && <button onClick={takePrintPhoto} style={{ padding: '12px 24px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>📸 Snap & Print</button>}
              <button onClick={skipPrintPhoto} style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>❌ Remove from PDF</button>
            </div>
            <button onClick={() => { setShowPrintModal(false); if(printStream) printStream.getTracks().forEach(t=>t.stop()); }} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* 🚀 PUBLISH SUCCESS MODAL */}
      {publishId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', maxWidth: '450px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', fontFamily: 'system-ui' }}>
            <div style={{ color: '#22c55e', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}><CheckCircle size={48} /></div>
            <h2 style={{ color: '#1e293b', margin: '0 0 10px 0' }}>Profile Published!</h2>
            <p style={{ color: '#475569', fontSize: '15px', marginBottom: '25px', lineHeight: '1.5' }}>Your profile has been saved to the cloud. You will soon be able to share it using a custom link.</p>
            <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', color: '#334155', wordBreak: 'break-all', marginBottom: '20px' }}>
              Document ID: {publishId}
            </div>
            <button onClick={() => setPublishId(null)} style={{ padding: '12px 24px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Done</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '30px auto', fontFamily: 'system-ui' }}>
        
        {/* --- MAIN APP CONTROL PANEL --- */}
        {!isPublicView && (
  <div className="no-print" style={{ backgroundColor: '#0f172a', padding: '20px 30px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid #1e293b' }}>

          {/* LEFT: View Toggles */}
          <div style={{ display: 'flex', backgroundColor: '#1e293b', borderRadius: '10px', padding: '6px' }}>
             <button onClick={() => setActiveView('resume')} style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: activeView === 'resume' ? '#38bdf8' : 'transparent', color: activeView === 'resume' ? '#0f172a' : '#94a3b8' }}>
               <FileText size={16} /> Resume Builder
             </button>
             <button onClick={() => setActiveView('coaching')} style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: activeView === 'coaching' ? '#8b5cf6' : 'transparent', color: activeView === 'coaching' ? '#ffffff' : '#94a3b8' }}>
               <BrainCircuit size={16} /> AI Coaching
             </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* MIDDLE: Global App Navigation (Sleek Icon-Only Buttons) */}
            <div style={{ display: 'flex', gap: '8px', paddingRight: '16px', borderRight: '1px solid #334155' }}>
              <button onClick={() => navigate('/dashboard')} title="My Resumes" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#c4b5fd', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
               <LayoutDashboard size={18} />
              </button>
              <button onClick={onReset} title="Start Over" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <RotateCcw size={18} />
              </button>
              <button onClick={handleSignOut} title="Sign Out" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <LogOut size={18} />
              </button>
            </div>

            {/* RIGHT: Document-Specific Actions (Prominent Buttons) */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* 🌟 UPGRADED: Regenerate button highlights Power Metrics if Premium */}
              <button onClick={onRegenerate} disabled={isGenerating} style={{ padding: '10px 20px', backgroundColor: isPremium ? 'rgba(245, 158, 11, 0.1)' : 'transparent', border: '1px solid #f59e0b', color: '#fbbf24', borderRadius: '8px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', opacity: isGenerating ? 0.5 : 1 }}>
                <RefreshCw size={16} className={isGenerating ? "spin-animation" : ""} /> 
                {isGenerating ? 'Drafting...' : (isPremium ? '✨ Power Regenerate' : 'Regenerate')}
              </button>
              <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              
              {activeView === 'resume' && (
                  <>
                    <button onClick={() => setIsEditingText(!isEditingText)} style={{ padding: '10px 20px', backgroundColor: isEditingText ? '#22c55e' : 'transparent', border: isEditingText ? 'none' : '1px solid #4f46e5', color: isEditingText ? '#fff' : '#818cf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>{isEditingText ? <><Save size={16} /> Save Text</> : <><Pencil size={16} /> Edit Text</>}</button>
                    <button onClick={handlePrintRequest} style={{ padding: '10px 20px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={16} /> Save PDF</button>
                    <button onClick={handlePublish} disabled={isPublishing} style={{ padding: '10px 20px', backgroundColor: isPublishing ? '#475569' : '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: isPublishing ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)' }}>
                      <UploadCloud size={16} /> {isPublishing ? 'Publishing...' : 'Publish'}
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>

)}
        {/* --- SECONDARY CONTROL BAR --- */}
        {!isPublicView && activeView === 'resume' && (
  <div className="no-print" style={{ backgroundColor: '#1e293b', padding: '15px 30px', display: 'flex', gap: '30px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><LayoutTemplate size={12}/> Template</span>
              
              {/* 🌟 UPGRADED: Dynamic Layout Buttons with Premium Paywall */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {layoutOptions.map(l => ( 
                  <button 
                    key={l.id} 
                    onClick={() => {
                      if (l.isPremiumOnly && !isPremium) {
                        alert("🌟 This is a Premium layout! Upgrade to unlock the Executive and Startup templates.");
                        return;
                      }
                      setLayout(l.id);
                    }} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      backgroundColor: layout === l.id ? '#38bdf8' : '#0f172a', 
                      color: layout === l.id ? '#0f172a' : '#cbd5e1', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: (l.isPremiumOnly && !isPremium) ? 0.6 : 1
                    }}>
                      {l.name}
                      {l.isPremiumOnly && !isPremium && <Lock size={12} color="#94a3b8" />}
                    </button> 
                ))}
              </div>

            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Palette size={12}/> Palette</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                {Object.keys(palettes).map(p => ( <button key={p} onClick={() => setPalette(p)} style={{ width: '28px', height: '28px', backgroundColor: palettes[p].primary, border: palette === p ? '3px solid #38bdf8' : '3px solid transparent', borderRadius: '50%', cursor: 'pointer' }} title={p} /> ))}
              </div>
            </div>
          </div>
        )}

        {/* 🧠 COACHING DASHBOARD VIEW */}
        {activeView === 'coaching' && (
          <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '60px', borderRadius: '0 0 16px 16px', minHeight: '850px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '15px' }}><BrainCircuit size={36} /> Post-Generation Analysis</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '50px' }}>Based on your experiences and your target role of <strong>{targetRole}</strong>, our AI engine has identified key opportunities for your career progression.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#38bdf8', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} /> High-Probability Role Matches</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Your metrics and leadership history strongly align with these specific job titles. You should actively search for these terms:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {editableData.coaching?.suggestedRoles?.map((role, idx) => ( <div key={idx} style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', borderLeft: '4px solid #38bdf8' }}>{role}</div> ))}
                </div>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f43f5e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={20} /> Critical Skill Gaps</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>To secure a high-end <strong>{targetRole}</strong> position, you should quickly acquire or emphasize these missing competencies:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {editableData.coaching?.skillGaps?.map((gap, idx) => (
                    <div key={idx} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f43f5e' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: '0 0 8px 0' }}>{gap.skill}</h4>
                      <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: '1.5' }}>{gap.reason}</p>
                      
                      {/* 🔥 NEW: Free vs Premium Learning Paths */}
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {/* The Free Option */}
                        <div style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #047857' }}>
                          <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>FREE</span>
                          {gap.freeResource || "Coursera Audit"}
                        </div>
                        {/* The Premium Option */}
                        <div style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #1d4ed8' }}>
                          <span style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>PREMIUM</span>
                          {gap.paidResource || "Industry Certification"}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📄 RESUME VIEW */}
        <div style={{ display: activeView === 'resume' ? 'block' : 'none' }}>
           <div className={`resume-container layout-${layout}`}>
            {(layout === 'signature' || layout === 'startup') && (
              <div className="sidebar-rail">
                <RenderMedia />
                {layout === 'signature' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div>
                      <h3 className="sidebar-title"><Target size={16} /> Core Expertise</h3>
                      <div className="skills-container">
                        {editableData.skills?.map((skill, idx) => ( isEditingText ? ( <input key={idx} style={{ ...inputStyle, width: '100%', fontSize: '14px', marginBottom: '8px' }} value={skill} onChange={(e) => updateSkill(idx, e.target.value)} /> ) : ( <div key={idx} className="skill-tag">{skill}</div> ) ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="main-content">
              
              {layout === 'executive' && ( <div style={{ display: 'flex', justifyContent: 'center' }}> <RenderMedia /> </div> )}
              <div style={{ marginBottom: '40px' }}>
                <h1 className="name-header">{name}</h1>
                
                {/* 🔥 MODERN PROFESSIONAL HEADLINE */}
                <h2 className="title-header">{targetRole}</h2>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', color: 'var(--text)', opacity: 0.8, fontSize: '14.5px', justifyContent: layout === 'executive' ? 'center' : 'flex-start' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {phone}</span><span style={{ opacity: 0.3 }}>|</span><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {email}</span>
                </div>
                {userData.baseline?.linkedin && (
                  <div style={{ marginTop: '20px', fontSize: '14px', display: 'flex', justifyContent: layout === 'executive' ? 'center' : 'flex-start' }}>
                    <a 
                      href={userData.baseline.linkedin.startsWith('http') ? userData.baseline.linkedin : `https://${userData.baseline.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      {userData.baseline.linkedin.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '40px' }}>
                {isEditingText ? ( <textarea style={{ ...inputStyle, minHeight: '120px', fontSize: '16px', lineHeight: '1.9' }} value={editableData.summary} onChange={(e) => setEditableData({...editableData, summary: e.target.value})} /> ) : ( <p style={{ fontSize: '16px', lineHeight: '1.9', opacity: 0.9 }}>{editableData.summary}</p> )}
              </div>
              {layout !== 'signature' && (
                <div style={{ marginBottom: '40px' }}>
                   <h3 className="section-title"><Target size={18} /> Core Competencies</h3>
                   <div className="skills-container">
                     {editableData.skills?.map((skill, idx) => ( isEditingText ? ( <input key={idx} style={{ ...inputStyle, width: '140px', fontSize: '13px', padding: '6px 12px', borderRadius: '30px' }} value={skill} onChange={(e) => updateSkill(idx, e.target.value)} /> ) : ( <span key={idx} className="skill-tag">{skill}</span> ) ))}
                   </div>
                </div>
              )}
              <div>
                <h3 className="section-title"><Briefcase size={18} /> Professional Experience</h3>
                {editableData.experience?.map((job, idx) => (
                  <div key={idx} className="job-item">
                    <div className="experience-header">
                      <div style={{ flex: 1, marginRight: '20px' }}>
                        {isEditingText ? (
                          <>
                            <input style={{ ...inputStyle, fontSize: '20px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }} value={job.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} />
                            <input style={{ ...inputStyle, fontSize: '16px', fontWeight: '500' }} value={job.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                          </>
                        ) : (
                          <>
                            <h4 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{job.title}</h4>
                            <span style={{ fontSize: '16px', fontWeight: '500', opacity: 0.8 }}>{job.company}</span>
                          </>
                        )}
                      </div>
                      {isEditingText ? ( <input style={{ ...inputStyle, width: '150px', fontSize: '13px', color: 'var(--accent)', fontWeight: '700', textAlign: 'right' }} value={job.dates} onChange={(e) => updateExperience(idx, 'dates', e.target.value)} /> ) : ( <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700', letterSpacing: '1px', marginTop: '8px' }}>{job.dates}</span> )}
                    </div>
                    {isEditingText ? ( <textarea style={{ ...inputStyle, minHeight: '80px', fontSize: '15px', lineHeight: '1.7', marginBottom: '16px' }} value={job.roleOverview} onChange={(e) => updateExperience(idx, 'roleOverview', e.target.value)} /> ) : ( <p style={{ fontSize: '15px', lineHeight: '1.7', opacity: 0.9, marginBottom: '16px' }}>{job.roleOverview}</p> )}
                    {job.metrics && job.metrics.length > 0 && (
                      <details className="metrics-toggle" open>
                        <summary><PlayCircle size={14} /> View Key Achievements</summary>
                        <ul className="metrics-list">
                          {job.metrics.map((m, i) => ( <li key={i} style={{ marginBottom: '8px' }}> {isEditingText ? ( <textarea style={{ ...inputStyle, minHeight: '50px', marginLeft: '-24px', width: 'calc(100% + 24px)' }} value={m} onChange={(e) => updateMetric(idx, i, e.target.value)} /> ) : ( m )} </li> ))}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 🔥 FIXED EDUCATION ARRAY RENDERER */}
              {showEdu && staticEducation.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                  <h3 className="section-title"><GraduationCap size={18} /> Education & Certifications</h3>
                  {staticEducation.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: idx !== staticEducation.length - 1 ? '16px' : '0' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{edu.degree}</h4>
                      <span style={{ fontSize: '15px', opacity: 0.8 }}>{edu.school}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </>
  );
}