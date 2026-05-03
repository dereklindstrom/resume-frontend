import { useState } from 'react';

export default function ExperienceDetails({ level, savedData, onComplete, onBack }) {
  
  const [workHistory, setWorkHistory] = useState(
    savedData?.workHistory || [
      { id: Date.now(), company: '', jobTitle: '', startDate: '', endDate: '', responsibilities: '', achievements: '' }
    ]
  );
 
  const isGrad = level === 'grad';

  const [showEdu, setShowEdu] = useState(savedData?.showEdu || false);
  
  // 🔥 UPGRADED: Education is now an array so they can add multiple!
  const [eduDetails, setEduDetails] = useState(
    savedData?.eduDetails && Array.isArray(savedData.eduDetails) 
      ? savedData.eduDetails 
      : [{ id: Date.now(), school: '', degree: '' }]
  );

  // --- EDUCATION LOGIC ---
  const handleEduChange = (id, field, value) => {
    setEduDetails(eduDetails.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };
  const addEdu = () => setEduDetails([...eduDetails, { id: Date.now(), school: '', degree: '' }]);
  const removeEdu = (id) => setEduDetails(eduDetails.filter(edu => edu.id !== id));

  // --- WORK LOGIC ---
  const handleWorkChange = (id, field, value) => {
    setWorkHistory(workHistory.map(job => job.id === id ? { ...job, [field]: value } : job));
  };
  const addWorkRole = () => setWorkHistory([...workHistory, { id: Date.now(), company: '', jobTitle: '', startDate: '', endDate: '', responsibilities: '', achievements: '' }]);
  const removeWorkRole = (id) => setWorkHistory(workHistory.filter(job => job.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ showEdu, eduDetails, workHistory });
  };

  // 🎨 THE MASTER BLUE-GRAY DESIGN SYSTEM
  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#0f172a' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)' },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { fontSize: '16px', color: '#64748b', margin: '0' },
    
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '32px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' },
    sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 },
    
    innerCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '20px' },
    
    // Header for the inner cards to hold the Remove button
    innerCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    innerCardTitle: { margin: 0, color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' },
    removeBtn: { color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'opacity 0.2s' },

    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' },
    
    input: { width: '100%', padding: '14px 16px', backgroundColor: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease', fontFamily: 'inherit' },
    textarea: { width: '100%', padding: '14px 16px', backgroundColor: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease', fontFamily: 'inherit', minHeight: '100px', resize: 'vertical' },
    
    toggleContainer: { display: 'flex', gap: '12px', marginBottom: '20px' },
    toggleBtn: (active) => ({ flex: 1, padding: '12px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: active ? '#eff6ff' : '#ffffff', color: active ? '#3b82f6' : '#64748b', border: active ? '2px solid #93c5fd' : '2px solid #e2e8f0' }),

    addBtn: { width: '100%', padding: '16px', backgroundColor: 'transparent', border: '2px dashed #cbd5e1', color: '#64748b', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s ease', marginBottom: '16px' },
    
    buttonContainer: { display: 'flex', gap: '16px', marginTop: '32px' },
    secondaryButton: { flex: 1, padding: '16px 24px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', color: '#475569', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s ease' },
    primaryButton: { flex: 1, padding: '16px 24px', backgroundColor: '#3b82f6', border: 'none', color: '#ffffff', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s ease' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Let's build your background.</h2>
          <p style={styles.subtitle}>Fill in the details below so our AI can format them perfectly.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* EDUCATION SECTION */}
          <div>
            <div style={styles.sectionHeader}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <h3 style={styles.sectionTitle}>Education & Certifications</h3>
            </div>
            
            <div style={styles.toggleContainer}>
              <button type="button" onClick={() => setShowEdu(true)} style={styles.toggleBtn(showEdu)}>Yes</button>
              <button type="button" onClick={() => setShowEdu(false)} style={styles.toggleBtn(!showEdu)}>No</button>
            </div>

            {showEdu && (
              <>
                {eduDetails.map((edu, index) => (
                  <div key={edu.id} style={styles.innerCard}>
                    <div style={styles.innerCardHeader}>
                      <h4 style={styles.innerCardTitle}>Institution #{index + 1}</h4>
                      {eduDetails.length > 1 && (
                        <button type="button" onClick={() => removeEdu(edu.id)} style={styles.removeBtn}>Remove</button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ ...styles.inputGroup, flex: 1, marginBottom: 0 }}>
                        <label style={styles.label}>Institution Name</label>
                        <input type="text" required value={edu.school} onChange={(e) => handleEduChange(edu.id, 'school', e.target.value)} style={styles.input} placeholder="e.g., Northern Illinois University" />
                      </div>
                      <div style={{ ...styles.inputGroup, flex: 1, marginBottom: 0 }}>
                        <label style={styles.label}>Degree / Certification</label>
                        <input type="text" required value={edu.degree} onChange={(e) => handleEduChange(edu.id, 'degree', e.target.value)} style={styles.input} placeholder="e.g., BFA Visual Communication" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEdu} style={styles.addBtn}>+ Add Another Degree/Cert</button>
              </>
            )}
          </div>

          {/* WORK EXPERIENCE ARRAY */}
          <div>
            <div style={styles.sectionHeader}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <h3 style={styles.sectionTitle}>Work Experience</h3>
            </div>
            
            {workHistory.map((job, index) => (
              <div key={job.id} style={styles.innerCard}>
                <div style={styles.innerCardHeader}>
                  <h4 style={styles.innerCardTitle}>Role #{index + 1}</h4>
                  {/* ✨ ONLY show the remove button if there is more than 1 job! */}
                  {workHistory.length > 1 && (
                    <button type="button" onClick={() => removeWorkRole(job.id)} style={styles.removeBtn}>Remove</button>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Company Name</label>
                    <input type="text" required value={job.company} onChange={(e) => handleWorkChange(job.id, 'company', e.target.value)} style={styles.input} />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Job Title</label>
                    <input type="text" required value={job.jobTitle} onChange={(e) => handleWorkChange(job.id, 'jobTitle', e.target.value)} style={styles.input} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Start Date</label>
                    <input type="text" placeholder="Jan 2022" value={job.startDate} onChange={(e) => handleWorkChange(job.id, 'startDate', e.target.value)} style={styles.input} />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>End Date</label>
                    <input type="text" placeholder="Present" value={job.endDate} onChange={(e) => handleWorkChange(job.id, 'endDate', e.target.value)} style={styles.input} />
                  </div>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Daily Responsibilities</label>
                  <textarea required placeholder="What did you do day-to-day?" value={job.responsibilities} onChange={(e) => handleWorkChange(job.id, 'responsibilities', e.target.value)} style={styles.textarea} />
                </div>
                <div style={{ ...styles.inputGroup, marginBottom: '0' }}>
                  <label style={styles.label}>Top Achievements / Metrics</label>
                  <textarea required placeholder="Awards, quota crushed, team size, etc." value={job.achievements} onChange={(e) => handleWorkChange(job.id, 'achievements', e.target.value)} style={styles.textarea} />
                </div>
              </div>
            ))}

            <button type="button" onClick={addWorkRole} style={styles.addBtn}>
              + Add Another Role
            </button>
          </div>

          {/* BOTTOM NAVIGATION BUTTONS */}
          <div style={styles.buttonContainer}>
            <button 
              type="button" 
              onClick={() => onBack({ workHistory, showEdu, eduDetails })} 
              style={styles.secondaryButton}
            >
              Back
            </button>
            <button type="submit" style={styles.primaryButton}>
              Continue to Target Role
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}