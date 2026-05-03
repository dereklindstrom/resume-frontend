import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, Target, Briefcase, GraduationCap, PlayCircle, Download, FileText } from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function PublicResumeView() {
  const { id } = useParams(); // Grabs the document ID from the URL
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const docRef = doc(db, "resumes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError(true);
      }
      setLoading(false);
    };
    fetchResume();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', color: '#334155', fontFamily: 'system-ui' }}><h2>Loading Profile...</h2></div>;
  if (error || !resumeData) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', color: '#ef4444', fontFamily: 'system-ui' }}><h2>Profile not found or link is invalid.</h2></div>;

  const { profileData, userData, design, media } = resumeData;
  const { name = "Professional", email = "", phone = "" } = userData?.baseline || {};
  const targetIndustry = userData?.objective?.targetIndustry || "";
  const targetRole = userData?.objective?.targetRole || "";
  const showEdu = userData?.experienceDetails?.showEdu || false;
  const staticEducation = userData?.experienceDetails?.eduDetails || {};

  const palettes = { cobalt: { primary: '#1e3a8a', accent: '#3b82f6', bg: '#ffffff', sidebar: '#f8fafc', text: '#334155' }, sage: { primary: '#2f3e46', accent: '#52796f', bg: '#ffffff', sidebar: '#cad2c5', text: '#354f52' }, terracotta: { primary: '#780000', accent: '#c1121f', bg: '#fffdf7', sidebar: '#fdf0d5', text: '#333333' }, midnight: { primary: '#f8fafc', accent: '#38bdf8', bg: '#0f172a', sidebar: '#1e293b', text: '#cbd5e1' }, monochrome: { primary: '#171717', accent: '#737373', bg: '#ffffff', sidebar: '#fafafa', text: '#404040' } };
  const activeColors = palettes[design?.palette || 'cobalt'];
  const typography = { signature: { font: '"Plus Jakarta Sans", sans-serif', nameWeight: 800, headingStyle: 'uppercase' }, startup: { font: '"Outfit", sans-serif', nameWeight: 600, headingStyle: 'capitalize' }, executive: { font: '"Playfair Display", serif', nameWeight: 700, headingStyle: 'uppercase' } };
  const layout = design?.layout || 'signature';
  const activeTypo = typography[layout];

  const RenderMedia = () => {
    if (!media || !media.hasMedia || media.mediaType === 'none' || !media.publicUrl) return null;
    const isFrame = design?.mediaStyle === 'frame'; 
    const isTint = design?.mediaStyle === 'tint';
    const width = media.shape === 'circle' ? '180px' : '160px'; 
    const height = media.shape === 'rectangle' ? '220px' : '180px'; 
    const borderRadius = media.shape === 'circle' ? '50%' : media.shape === 'rectangle' ? '4px' : '16px';
    
    return (
      <div className="video-module-print-hide" style={{ textAlign: 'center', marginBottom: layout === 'startup' ? '0' : '40px', position: 'relative', display: 'inline-block' }}>
        {isFrame && <div style={{ position: 'absolute', top: '10px', left: '-10px', width: '100%', height: '100%', backgroundColor: 'var(--primary)', borderRadius, zIndex: 0, opacity: 0.8 }} />}
        <div style={{ position: 'relative', width, height, borderRadius, overflow: 'hidden', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', backgroundColor: '#000', border: `3px solid var(--accent)`, zIndex: 1 }}>
          {isTint && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--primary)', mixBlendMode: 'color', pointerEvents: 'none', zIndex: 2 }} />}
          {media.mediaType === 'video' ? (
            <video className="web-video" src={media.publicUrl} controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img className="print-photo" src={media.publicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');
          body { margin: 0; background-color: #f1f5f9; }
          .resume-container { --primary: ${activeColors.primary}; --accent: ${activeColors.accent}; --bg: ${activeColors.bg}; --sidebar: ${activeColors.sidebar}; --text: ${activeColors.text}; --font: ${activeTypo.font}; font-family: var(--font); background: var(--bg); color: var(--text); border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); min-height: 850px; display: flex; flex-direction: column; overflow: hidden; }
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
            h1, h2, h3, h4 { page-break-after: avoid !important; break-after: avoid !important; } .web-video { display: none !important; } 
            .video-module-print-hide > div { width: 120px !important; height: 120px !important; border-width: 2px !important; }
          }
        `}
      </style>

      <div style={{ maxWidth: '1200px', margin: '40px auto', fontFamily: 'system-ui' }}>
        
        {/* PUBLIC ACTION BAR */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold' }}>
            <FileText size={20} /> ResuME Profile
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => window.print()} style={{ padding: '10px 20px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={16} /> Save as PDF
            </button>
            <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#0f172a', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              Build Your Own
            </Link>
          </div>
        </div>

        {/* RESUME DISPLAY */}
        <div className={`resume-container layout-${layout}`}>
          {(layout === 'signature' || layout === 'startup') && (
            <div className="sidebar-rail">
              <RenderMedia />
              {layout === 'signature' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <div>
                    <h3 className="sidebar-title"><Target size={16} /> Core Expertise</h3>
                    <div className="skills-container">
                      {profileData?.skills?.map((skill, idx) => ( <div key={idx} className="skill-tag">{skill}</div> ))}
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
              <h2 className="title-header">{targetRole} | {targetIndustry}</h2>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', color: 'var(--text)', opacity: 0.8, fontSize: '14.5px', justifyContent: layout === 'executive' ? 'center' : 'flex-start' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {phone}</span><span style={{ opacity: 0.3 }}>|</span><span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {email}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.9', opacity: 0.9 }}>{profileData?.summary}</p>
            </div>
            
            {layout !== 'signature' && (
              <div style={{ marginBottom: '40px' }}>
                 <h3 className="section-title"><Target size={18} /> Core Competencies</h3>
                 <div className="skills-container">
                   {profileData?.skills?.map((skill, idx) => ( <span key={idx} className="skill-tag">{skill}</span> ))}
                 </div>
              </div>
            )}
            
            <div>
              <h3 className="section-title"><Briefcase size={18} /> Professional Experience</h3>
              {profileData?.experience?.map((job, idx) => (
                <div key={idx} className="job-item">
                  <div className="experience-header">
                    <div>
                      <h4 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{job.title}</h4>
                      <span style={{ fontSize: '16px', fontWeight: '500', opacity: 0.8 }}>{job.company}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700', letterSpacing: '1px', marginTop: '8px' }}>{job.dates}</span>
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', opacity: 0.9, marginBottom: '16px' }}>{job.roleOverview}</p>
                  {job.metrics && job.metrics.length > 0 && (
                    <details className="metrics-toggle" open>
                      <summary><PlayCircle size={14} /> View Key Achievements</summary>
                      <ul className="metrics-list">
                        {job.metrics.map((m, i) => ( <li key={i} style={{ marginBottom: '8px' }}>{m}</li> ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {showEdu && staticEducation.degree && staticEducation.degree.trim() !== "" && (
              <div style={{ marginTop: '40px' }}>
                <h3 className="section-title"><GraduationCap size={18} /> Education</h3>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{staticEducation.degree}</h4>
                <span style={{ fontSize: '15px', opacity: 0.8 }}>{staticEducation.school}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}