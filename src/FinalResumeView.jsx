import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Mail, Phone, Target, Briefcase, GraduationCap, PlayCircle, Pencil, RefreshCw, Download, RotateCcw, LayoutDashboard, LayoutTemplate, Palette, Save, FileText, BrainCircuit, TrendingUp, AlertCircle, UploadCloud, CheckCircle, LogOut, Lock, Trash2, Star, ArrowLeft, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';


import { db, storage, auth } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';

// 🌟 ADDED onEditMedia to the props!
// 🌟 Added initialLayout and initialPalette to the props list
export default function FinalResumeView({ resumeText, userData, editId, onReset, onRegenerate, isGenerating, isPublicView = false, isPremium = false, subscriptionTier = 'free', onEditMedia, onEditProfile, initialLayout = 'signature', initialPalette = 'cobalt' }) {  
  const [activeView, setActiveView] = useState('resume'); 
  
  // 🌟 Use the props to set the initial state!
  const [layout, setLayout] = useState(initialLayout); 
  const [palette, setPalette] = useState(initialPalette);
  
  const [themeMode, setThemeMode] = useState('preset'); 
  const [customTheme, setCustomTheme] = useState({
    primary: '#1e3a8a',
    accent: '#3b82f6',
    bg: '#ffffff',
    text: '#334155',
    font: '"Plus Jakarta Sans", sans-serif'
  });

  const navigate = useNavigate();
  
  const [editableData, setEditableData] = useState({ 
    summary: "Loading profile...", skills: [], experience: [], education: {}, 
    coaching: { suggestedRoles: ["Loading..."], skillGaps: [] } 
  });

  // 🌟 NEW: Local Media State so we can "Remove" it instantly from the UI
  const [localMedia, setLocalMedia] = useState(userData?.media || { hasMedia: false, mediaType: 'none' });

  useEffect(() => {
    if (userData?.media) {
      setLocalMedia(userData.media);
    }
  }, [userData?.media]);

  const resumeRef = useRef(null);
  const handleExportPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${userData?.baseline?.name ? userData.baseline.name.replace(/\s+/g, '_') : 'My'}_ResuME`,
  });
  const [showQR, setShowQR] = useState(false);
  const activeDocId = publishId || editId; // Knows the ID if they just published OR if they loaded from the dashboard

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
  
  const { name = "Derek Lindstrom", email = "email@example.com", phone = "(555) 555-5555" } = userData?.baseline || {};
  const targetRole = userData?.objective?.targetRole || "Professional Resume";
  const showEdu = userData?.experienceDetails?.showEdu || false;
  const staticEducation = Array.isArray(userData?.experienceDetails?.eduDetails) ? userData.experienceDetails.eduDetails : [];
    
  const palettes = { cobalt: { primary: '#1e3a8a', accent: '#3b82f6', bg: '#ffffff', sidebar: '#f8fafc', text: '#334155' }, sage: { primary: '#2f3e46', accent: '#52796f', bg: '#ffffff', sidebar: '#cad2c5', text: '#354f52' }, terracotta: { primary: '#780000', accent: '#c1121f', bg: '#fffdf7', sidebar: '#fdf0d5', text: '#333333' }, midnight: { primary: '#f8fafc', accent: '#38bdf8', bg: '#0f172a', sidebar: '#1e293b', text: '#cbd5e1' }, monochrome: { primary: '#171717', accent: '#737373', bg: '#ffffff', sidebar: '#fafafa', text: '#404040' } };
  const typography = { signature: { font: '"Plus Jakarta Sans", sans-serif', nameWeight: 800, headingStyle: 'uppercase' }, startup: { font: '"Outfit", sans-serif', nameWeight: 600, headingStyle: 'capitalize' }, executive: { font: '"Playfair Display", serif', nameWeight: 700, headingStyle: 'uppercase' } };
   
  const appliedColors = themeMode === 'custom' ? customTheme : palettes[palette];
  const appliedFont = themeMode === 'custom' ? customTheme.font : (typography[layout]?.font || typography.signature.font);
  const activeTypo = typography[layout] || typography.signature;

  const updateExperience = (index, field, value) => { const newExp = [...editableData.experience]; newExp[index][field] = value; setEditableData({ ...editableData, experience: newExp }); };
  const updateMetric = (jobIndex, metricIndex, value) => { const newExp = [...editableData.experience]; newExp[jobIndex].metrics[metricIndex] = value; setEditableData({ ...editableData, experience: newExp }); };
  const updateSkill = (index, value) => { const newSkills = [...editableData.skills]; newSkills[index] = value; setEditableData({ ...editableData, skills: newSkills }); };

  const handlePrintRequest = () => { setIsEditingText(false); if (activeView !== 'resume') setActiveView('resume'); setTimeout(() => { if (localMedia.mediaType === 'video' && !pdfAction) setShowPrintModal(true); else handleExportPDF(); }, 100); };
  const startPrintCamera = async () => { try { setPrintStream(await navigator.mediaDevices.getUserMedia({ video: true })); } catch (error) { alert("Camera access needed."); } };
  const handlePrintVideoMount = (element) => { printVideoRef.current = element; if (element && printStream) { element.srcObject = printStream; element.onloadedmetadata = () => { element.play().catch(e => console.error(e)); }; } };
  
  const takePrintPhoto = () => { if (printVideoRef.current && printCanvasRef.current) { const video = printVideoRef.current; const canvas = printCanvasRef.current; canvas.width = video.videoWidth; canvas.height = video.videoHeight; const ctx = canvas.getContext('2d'); ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, canvas.width, canvas.height); setPrintPhotoUrl(canvas.toDataURL('image/jpeg', 0.9)); if (printStream) printStream.getTracks().forEach(t => t.stop()); setPrintStream(null); setPdfAction('photo'); setShowPrintModal(false); setTimeout(() => handleExportPDF(), 100); } };
  const skipPrintPhoto = () => { if (printStream) printStream.getTracks().forEach(t => t.stop()); setPrintStream(null); setPdfAction('remove'); setShowPrintModal(false); setTimeout(() => handleExportPDF(), 100); };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // 🌟 SAFETY NET 1: Ensure the user's session didn't drop
      if (!auth.currentUser) {
        alert("Session expired. Please log in again to publish.");
        setIsPublishing(false);
        return;
      }

      let publicMediaUrl = null;
        const activeMediaUrl = printPhotoUrl || localMedia.videoUrl || localMedia.photoUrl || localMedia.previewUrl || localMedia.url || localMedia.publicUrl;

      // 🌟 SAFETY NET 2: Ensure activeMediaUrl exists AND is a string before checking startsWith!
      if (activeMediaUrl && typeof activeMediaUrl === 'string' && activeMediaUrl.startsWith('blob:')) {        const response = await fetch(activeMediaUrl); 
        const blob = await response.blob(); 
        const fileRef = ref(storage, `media/${Date.now()}-profile`);
        await uploadBytes(fileRef, blob); 
        publicMediaUrl = await getDownloadURL(fileRef);
      } else {
        publicMediaUrl = activeMediaUrl || null;
      }

      const docRef = await addDoc(collection(db, "resumes"), {
        userId: auth.currentUser.uid, 
        profileData: editableData,
        userData: { baseline: userData.baseline, objective: userData.objective, experienceDetails: userData.experienceDetails },
        design: { layout, palette },
        media: { hasMedia: !!publicMediaUrl || localMedia.hasMedia, mediaType: printPhotoUrl ? 'photo' : localMedia.mediaType, shape: localMedia.shape || 'circle', publicUrl: publicMediaUrl },
        createdAt: new Date().toISOString()
      });
      setPublishId(docRef.id);
    } catch (error) { 
      // 🌟 SAFETY NET 3: Actually print the error to the console!
      console.error("🔥 PUBLISH ERROR DETECTED:", error);
      alert(`Failed to publish: ${error.message}. Check the console for full details.`); 
    }
    setIsPublishing(false);
  };

  const inputStyle = { width: '100%', background: isEditingText ? 'rgba(56, 189, 248, 0.1)' : 'transparent', border: isEditingText ? '1px dashed #38bdf8' : 'none', borderRadius: '4px', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', padding: isEditingText ? '4px 8px' : '0', outline: 'none', resize: 'vertical', boxSizing: 'border-box' };

  // 🔥 UPGRADED MEDIA COMPONENT: Hover Overlay & Safety Net Loader
  const RenderMedia = () => {
    const [isHovering, setIsHovering] = useState(false);

    if (!localMedia.hasMedia || localMedia.mediaType === 'none') return null;
    
    let width = '120px';
    let height = '120px';
    
    if (layout === 'signature') {
      width = localMedia.shape === 'circle' ? '160px' : '150px';
      height = localMedia.shape === 'rectangle' ? '190px' : '160px';
    } else if (layout === 'startup') {
      width = localMedia.shape === 'circle' ? '110px' : '100px';
      height = localMedia.shape === 'rectangle' ? '130px' : '110px';
    } else { // executive
      width = localMedia.shape === 'circle' ? '140px' : '130px';
      height = localMedia.shape === 'rectangle' ? '160px' : '140px';
    }
    
    const borderRadius = localMedia.shape === 'circle' ? '50%' : localMedia.shape === 'rectangle' ? '8px' : '16px';
    
    // 🌟 THE SAFETY NET: Grabs the image no matter what property name the uploader used!
    const imageSource = printPhotoUrl || localMedia.photoUrl || localMedia.previewUrl || localMedia.preview || localMedia.url || localMedia.publicUrl;
    
    return (
      <div 
        className={`video-module-print-hide ${pdfAction === 'remove' ? 'pdf-remove-shape' : ''}`} 
        style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div style={{ position: 'relative', width, height, borderRadius, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', border: `3px solid var(--accent)`, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {localMedia.mediaType === 'video' && (
            <video className="web-video" src={localMedia.videoUrl || localMedia.publicUrl} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          
          {(imageSource || localMedia.mediaType === 'photo') && (
            <img 
              className={localMedia.mediaType === 'video' ? "print-photo" : ""} 
              src={imageSource} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onError={(e) => {
                // If it still breaks, show a gray error instead of a black void!
                e.target.style.display = 'none';
                e.target.parentElement.style.backgroundColor = '#334155';
              }}
            />
          )}

          {/* 🌟 THE HOVER OVERLAY UI */}
          {!isPublicView && isHovering && (
            <div className="no-print" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
              <button 
                onClick={onEditMedia} 
                style={{ padding: '6px 16px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Pencil size={14} /> Retake
              </button>
              <button 
                onClick={() => setLocalMedia({ ...localMedia, hasMedia: false, mediaType: 'none' })} 
                style={{ padding: '6px 16px', backgroundColor: 'transparent', color: '#f8fafc', border: '1px solid #94a3b8', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          )}

        </div>
      </div>
    );
  };

  const RenderQRCode = () => {
    if (!showQR || !activeDocId) return null;
    const url = `${window.location.origin}/profile/${activeDocId}`;
    return (
      <div className="print-qr-code" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div style={{ padding: '6px', background: '#fff', borderRadius: '8px', border: '2px solid var(--accent)', display: 'inline-block' }}>
          <QRCodeCanvas value={url} size={75} level="H" />
        </div>
        <span style={{ fontSize: '9px', color: 'var(--accent)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Scan for Video</span>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
          .resume-container { 
            --primary: ${appliedColors.primary}; 
            --accent: ${appliedColors.accent}; 
            --bg: ${appliedColors.bg}; 
            --sidebar: ${themeMode === 'custom' ? appliedColors.bg : appliedColors.sidebar}; 
            --text: ${appliedColors.text}; 
            --font: ${appliedFont}; 
            
            font-family: var(--font); background: var(--bg); color: var(--text); 
            border-radius: 0 0 16px 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
            min-height: 850px; display: flex; flex-direction: column; 
          }
          .resume-container h1, .resume-container h2, .resume-container h3, .resume-container h4, .resume-container p { margin: 0; }
          
          .sidebar-rail { background: var(--sidebar); padding: 40px 24px; border-right: 1px solid rgba(0,0,0,0.05); } 
          .main-content { padding: 40px 30px; flex: 1; text-align: left; }
          
          .layout-signature { flex-direction: row; } 
          .layout-signature .sidebar-rail { flex: 0 0 230px; max-width: 230px; } 
          .layout-signature .main-content { flex: 1; max-width: none; }
          
          .layout-startup { flex-direction: column; }
          .layout-executive .main-content { max-width: 850px; margin: 0 auto; text-align: center; } 
          .layout-executive .experience-header { flex-direction: column; align-items: center; } 
          .layout-executive .metrics-toggle summary { justify-content: center; } 
          .layout-executive .metrics-list { list-style-position: inside; }
          
          .name-header { font-size: clamp(36px, 5vw, 56px); font-weight: ${activeTypo.nameWeight}; color: var(--primary); letter-spacing: -1px; margin-bottom: 8px !important; line-height: 0.9; margin-top: -4px; }
          .title-header { font-size: 18px; color: var(--accent); text-transform: ${activeTypo.headingStyle}; letter-spacing: 3px; font-weight: 600; margin-bottom: 24px !important; display: block; }
          .section-title { font-size: 14px; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px !important; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 12px; display: flex; alignItems: center; gap: 8px; }
          
          .job-item { margin-bottom: 40px; } .experience-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
          .metrics-toggle { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.05); border-radius: 12px; padding: 16px; transition: all 0.3s ease; } .metrics-toggle summary { cursor: pointer; font-size: 13px; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; list-style: none; outline: none; } .metrics-toggle summary::-webkit-details-marker { display: none; } .metrics-list { margin: 12px 0 0 0; padding-left: 24px; font-size: 14.5px; line-height: 1.8; color: var(--text); }
          
          @media print {
            @page { size: letter portrait; margin: 0.5in 0; } 
            body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } 
            .no-print { display: none !important; }
            
            .resume-container { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; padding: 0 0.3in !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; min-height: auto !important; height: auto !important; display: block !important; }
            .resume-container::after { content: ""; display: table; clear: both; }

            .layout-signature { display: block !important; } 
            .layout-signature .sidebar-rail { float: left !important; width: 170px !important; padding: 0 !important; background: transparent !important; border: none !important; }
            .layout-signature .main-content { margin-left: 190px !important; padding: 0 !important; display: block !important; }
            
            .layout-startup { display: block !important; }
            .layout-executive .main-content { display: block !important; padding: 0 !important; }

            .name-header { font-size: 26pt !important; margin-bottom: 4px !important; line-height: 1 !important; margin-top: 0 !important; } 
            .title-header { font-size: 12pt !important; margin-bottom: 16px !important; } 
            .section-title { font-size: 11pt !important; margin-bottom: 12px !important; padding-bottom: 4px !important; margin-top: 16px !important; }
            p, span, li, .metrics-list { font-size: 9.5pt !important; line-height: 1.4 !important; }
            
            .job-item { margin-bottom: 20px !important; page-break-inside: avoid !important; break-inside: avoid !important; display: block !important; position: relative !important; } 
            .experience-header, .section-title, h1, h2, h3, h4 { page-break-after: avoid !important; break-after: avoid !important; page-break-inside: avoid !important; break-inside: avoid !important; } 
            
            .experience-header h4 { font-size: 11pt !important; }
            .metrics-toggle summary { display: none !important; } 
            .metrics-toggle { background: transparent !important; border: none !important; padding: 0 !important; display: block !important; } 
            .metrics-list { display: block !important; margin-top: 4px !important; padding-left: 15px !important; }
            input, textarea { border: none !important; background: transparent !important; resize: none !important; padding: 0 !important; }
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
            
            {/* LEFT SIDE: Toggles & Upgrade Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              
              <div style={{ display: 'flex', backgroundColor: '#1e293b', borderRadius: '10px', padding: '6px' }}>
                <button onClick={() => setActiveView('resume')} style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: activeView === 'resume' ? '#38bdf8' : 'transparent', color: activeView === 'resume' ? '#0f172a' : '#94a3b8' }}>
                  <FileText size={16} /> Resume Builder
                </button>
                <button onClick={() => setActiveView('coaching')} style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: activeView === 'coaching' ? '#8b5cf6' : 'transparent', color: activeView === 'coaching' ? '#ffffff' : '#94a3b8' }}>
                  <BrainCircuit size={16} /> AI Coaching
                </button>
              </div>

              {/* 🌟 NEW: Dynamic Tier Badge & Upgrade Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: subscriptionTier === 'executive' ? '#fbbf24' : subscriptionTier === 'pro' ? '#38bdf8' : '#94a3b8' }}>
                  <Star size={14} />
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Tier
                </div>
                
                {subscriptionTier !== 'executive' && (
                  <button 
                    onClick={() => navigate('/pricing')} 
                    style={{ padding: '6px 16px', backgroundColor: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#10b981'; }}
                  >
                    Upgrade
                  </button>
                )}
              </div>

            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={onEditProfile} 
                  style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}
                >
                  <ArrowLeft size={16} /> Edit Form
                </button>
                <button onClick={onRegenerate} disabled={isGenerating} style={{ padding: '10px 20px', backgroundColor: isPremium ? 'rgba(245, 158, 11, 0.1)' : 'transparent', border: '1px solid #f59e0b', color: '#fbbf24', borderRadius: '8px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', opacity: isGenerating ? 0.5 : 1 }}>
                  <RefreshCw size={16} className={isGenerating ? "spin-animation" : ""} /> 
                  {isGenerating ? 'Drafting...' : (isPremium ? '✨ Power Regenerate' : 'Regenerate')}
                </button>
                <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                
                {activeView === 'resume' && (
                  <>
                    <button onClick={() => setIsEditingText(!isEditingText)} style={{ padding: '10px 20px', backgroundColor: isEditingText ? '#22c55e' : 'transparent', border: isEditingText ? 'none' : '1px solid #4f46e5', color: isEditingText ? '#fff' : '#818cf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>{isEditingText ? <><Save size={16} /> Save Text</> : <><Pencil size={16} /> Edit Text</>}</button>
                    <button 
                      onClick={() => {
                        if (!activeDocId) {
                          alert("Please click 'Publish' first to generate your custom profile link!");
                          return;
                        }
                        setShowQR(!showQR);
                      }} 
                      style={{ padding: '10px 20px', backgroundColor: showQR ? '#1e293b' : 'transparent', border: '1px solid #38bdf8', color: showQR ? '#f8fafc' : '#38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <QrCode size={16} /> {showQR ? 'Hide QR Code' : 'Add QR Code'}
                    </button>
                    
                    <button onClick={handlePrintRequest} style={{ padding: '10px 20px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={16} /> Print </button>
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
          <div className="no-print" style={{ backgroundColor: '#1e293b', padding: '20px 30px', display: 'flex', gap: '30px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><LayoutTemplate size={12}/> Template</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {layoutOptions.map(l => ( 
                  <button key={l.id} onClick={() => setLayout(l.id)} style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: layout === l.id ? '#38bdf8' : '#0f172a', color: layout === l.id ? '#0f172a' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    {l.name}
                  </button> 
                ))}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid #334155', paddingLeft: '30px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Palette size={12}/> Color Mode</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px' }}>
                <button onClick={() => setThemeMode('preset')} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: themeMode === 'preset' ? '#334155' : 'transparent', color: themeMode === 'preset' ? '#fff' : '#94a3b8' }}>Presets</button>
                <button 
                  onClick={() => { 
                    if (isPremium) setThemeMode('custom'); 
                    else navigate('/pricing'); // 👈 Changed from alert()
                  }} 
                  style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: themeMode === 'custom' ? '#38bdf8' : 'transparent', color: themeMode === 'custom' ? '#0f172a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Custom {!isPremium && <Lock size={12} />}
                </button>
              </div>
            </div>
            {themeMode === 'preset' ? (
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Quick Palettes</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {Object.keys(palettes).map(p => ( <button key={p} onClick={() => setPalette(p)} style={{ width: '28px', height: '28px', backgroundColor: palettes[p].primary, border: palette === p ? '3px solid #38bdf8' : '3px solid transparent', borderRadius: '50%', cursor: 'pointer' }} title={p} /> ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '20px', backgroundColor: '#0f172a', padding: '10px 15px', borderRadius: '8px', border: '1px solid #38bdf8' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[ { key: 'primary', label: 'Primary' }, { key: 'accent', label: 'Accent' }, { key: 'text', label: 'Text' }, { key: 'bg', label: 'Background' } ].map(colorDef => (
                    <div key={colorDef.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{colorDef.label}</span>
                      <input type="color" value={customTheme[colorDef.key]} onChange={(e) => setCustomTheme({...customTheme, [colorDef.key]: e.target.value})} style={{ width: '30px', height: '30px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }} />
                    </div>
                  ))}
                </div>
                <div style={{ width: '1px', backgroundColor: '#334155' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Typography</span>
                  <select value={customTheme.font} onChange={(e) => setCustomTheme({...customTheme, font: e.target.value})} style={{ backgroundColor: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', outline: 'none' }}>
                    <option value='"Plus Jakarta Sans", sans-serif'>Plus Jakarta (Modern)</option>
                    <option value='"Outfit", sans-serif'>Outfit (Tech)</option>
                    <option value='"Playfair Display", serif'>Playfair (Executive)</option>
                    <option value='"Inter", sans-serif'>Inter (Clean)</option>
                    <option value='"Courier New", monospace'>Courier (Code)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🧠 COACHING DASHBOARD VIEW */}
        {activeView === 'coaching' && (
          <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '60px', borderRadius: '0 0 16px 16px', minHeight: '850px', position: 'relative', overflow: 'hidden' }}>
            {['free', 'basic'].includes(subscriptionTier) && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                <div style={{ backgroundColor: '#1e293b', padding: '50px', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                  <Lock size={48} color="#38bdf8" style={{ margin: '0 auto 20px auto' }} />
                  <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc', margin: '0 0 16px 0' }}>Unlock Career Coaching</h3>
                  <p style={{ fontSize: '16px', color: '#cbd5e1', marginBottom: '32px', lineHeight: '1.6' }}>Upgrade to a <strong>Pro</strong> or <strong>Executive</strong> plan to reveal your high-probability role matches and critical skill gap analysis.</p>
                  <button onClick={() => navigate('/pricing')} style={{ padding: '14px 28px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', width: '100%', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}>
                    View Upgrade Plans
                  </button>
                </div>
              </div>
            )}
            <div style={{ filter: ['free', 'basic'].includes(subscriptionTier) ? 'blur(8px)' : 'none', opacity: ['free', 'basic'].includes(subscriptionTier) ? 0.4 : 1, pointerEvents: ['free', 'basic'].includes(subscriptionTier) ? 'none' : 'auto', transition: 'all 0.3s ease' }}>
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
                    {editableData.coaching?.skillGaps?.map((gap, idx) => (
                      <div key={idx} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f43f5e' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', margin: '0 0 8px 0' }}>{gap.skill}</h4>
                        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: '1.5' }}>{gap.reason}</p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #047857' }}>
                            <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>FREE</span> {gap.freeResource || "Coursera Audit"}
                          </div>
                          {subscriptionTier === 'executive' ? (
                            <div style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #1d4ed8' }}>
                              <span style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>PREMIUM</span> {gap.paidResource || "Industry Certification"}
                            </div>
                          ) : (
                            <div onClick={() => navigate('/pricing')} style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', border: '1px dashed #475569', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
                              <Lock size={12} /> Executive Tier Path
                            </div>
                          )}
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
           <div ref={resumeRef} className={`resume-container print-container layout-${layout}`}>
            
            {layout === 'signature' && (
              <div className="sidebar-rail">
                <RenderMedia />
                <div style={{ marginTop: '40px' }}>
                  <h3 className="sidebar-title" style={{ fontSize: '14px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={16} /> Core Expertise
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {editableData.skills?.map((skill, idx) => ( 
                      isEditingText ? ( 
                        <input key={idx} style={{ ...inputStyle, width: '100%', fontSize: '13px', padding: '4px' }} value={skill} onChange={(e) => updateSkill(idx, e.target.value)} /> 
                      ) : ( 
                        <div key={idx} style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>{skill}</div> 
                      ) 
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="main-content">
              
              {layout === 'executive' && ( <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}> <RenderMedia /> </div> )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '30px', flexDirection: layout === 'executive' ? 'column-reverse' : 'row' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: layout === 'executive' ? 'center' : 'flex-start', textAlign: layout === 'executive' ? 'center' : 'left' }}>
                  <h1 className="name-header">{name}</h1>
                  <h2 className="title-header">{targetRole}</h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <RenderQRCode />
                  {layout === 'startup' && <RenderMedia />}
                </div>
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', color: 'var(--text)', opacity: 0.8, fontSize: '14.5px', justifyContent: layout === 'executive' ? 'center' : 'flex-start' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {phone}</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {email}</span>
                  </div>
                  
                  {userData.baseline?.linkedin && (
                    <div style={{ marginTop: '16px', fontSize: '14px', display: 'flex', justifyContent: layout === 'executive' ? 'center' : 'flex-start' }}>
                      <a href={userData.baseline.linkedin.startsWith('http') ? userData.baseline.linkedin : `https://${userData.baseline.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        {userData.baseline.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                {layout === 'startup' && <RenderMedia />}
              </div>

              <div style={{ marginBottom: '40px' }}>
                {isEditingText ? ( <textarea style={{ ...inputStyle, minHeight: '120px', fontSize: '16px', lineHeight: '1.9' }} value={editableData.summary} onChange={(e) => setEditableData({...editableData, summary: e.target.value})} /> ) : ( <p style={{ fontSize: '16px', lineHeight: '1.9', opacity: 0.9 }}>{editableData.summary}</p> )}
              </div>
              
             {layout === 'signature' && (
              <div className="sidebar-rail" style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Top Section: Photo & Skills */}
                <div>
                  <RenderMedia />
                  <div style={{ marginTop: '40px' }}>
                    <h3 className="sidebar-title" style={{ fontSize: '14px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={16} /> Core Expertise
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {editableData.skills?.map((skill, idx) => ( 
                        isEditingText ? ( 
                          <input key={idx} style={{ ...inputStyle, width: '100%', fontSize: '13px', padding: '4px' }} value={skill} onChange={(e) => updateSkill(idx, e.target.value)} /> 
                        ) : ( 
                          <div key={idx} style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>{skill}</div> 
                        ) 
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🌟 NEW: QR Code pinned to the absolute bottom of the rail! */}
                <div style={{ marginTop: 'auto', paddingTop: '40px', display: 'flex', justifyContent: 'center' }}>
                  <RenderQRCode />
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