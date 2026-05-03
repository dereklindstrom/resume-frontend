import { useState } from 'react';

export default function ObjectiveForm({ workHistory, savedData, onComplete, onBack }) {
  // Load saved data so the Back button works seamlessly!
  const [targetIndustry, setTargetIndustry] = useState(savedData?.targetIndustry || '');
  const [targetRole, setTargetRole] = useState(savedData?.targetRole || '');
  const [confirmedSkills, setConfirmedSkills] = useState(savedData?.confirmedSkills || []);

  // 🔥 EXPANDED SUPERPOWERS LIST
  const superpowers = [
    "Team Leadership & Development",
    "Process Optimization & Scaling",
    "Data Analysis & Insights",
    "Client Relationship Building",
    "Revenue & Sales Growth",
    "Strategic Business Planning",
    "Agile Project Management",
    "Brand Storytelling",
    "Technical Troubleshooting",
    "Cross-functional Collaboration",
    "High-Stakes Negotiation",
    "Creative Problem Solving"
  ];

  const toggleSkill = (skill) => {
    if (confirmedSkills.includes(skill)) {
      setConfirmedSkills(confirmedSkills.filter(s => s !== skill));
    } else {
      if (confirmedSkills.length < 8) {
        setConfirmedSkills([...confirmedSkills, skill]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ targetIndustry, targetRole, confirmedSkills });
  };

  // 🎨 THE MASTER BLUE-GRAY DESIGN SYSTEM
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: '#0f172a',
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
    },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { fontSize: '16px', color: '#64748b', margin: '0' },
    
    sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px', marginTop: '32px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' },
    
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' },
    
    input: {
      width: '100%', padding: '14px 16px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0',
      borderRadius: '12px', fontSize: '16px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
      transition: 'all 0.2s ease', fontFamily: 'inherit'
    },
    
    // NEW: Styles for the Superpower Chips
    chipContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: '12px'
    },
    chip: (isActive) => ({
      padding: '10px 18px',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isActive ? '#eff6ff' : '#ffffff',
      color: isActive ? '#3b82f6' : '#64748b',
      border: isActive ? '2px solid #3b82f6' : '2px solid #e2e8f0',
      userSelect: 'none'
    }),
    chipWarning: {
      fontSize: '13px',
      color: confirmedSkills.length >= 3 ? '#ef4444' : '#64748b',
      marginTop: '12px',
      fontWeight: '500'
    },

    buttonContainer: { display: 'flex', gap: '16px', marginTop: '40px' },
    secondaryButton: {
      flex: 1, padding: '16px 24px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0',
      color: '#475569', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s ease'
    },
    primaryButton: {
      flex: 1, padding: '16px 24px', backgroundColor: '#3b82f6', border: 'none',
      color: '#ffffff', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px',
      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Where are you heading?</h2>
          <p style={styles.subtitle}>Tell us your target role so we can position you perfectly.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Target Industry</label>
              <input required type="text" value={targetIndustry} onChange={(e) => setTargetIndustry(e.target.value)} style={styles.input} placeholder="e.g., Tech, Healthcare, Finance" />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Specific Target Role</label>
              <input required type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} style={styles.input} placeholder="e.g., Senior Product Manager" />
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>⚡ Choose Your Superpowers</h3>
            <p style={styles.label} style={{ fontWeight: '400', color: '#64748b' }}>Select up to 8 core strengths that define your professional brand.</p>
            
            <div style={styles.chipContainer}>
              {superpowers.map((skill) => (
                <div 
                  key={skill} 
                  onClick={() => toggleSkill(skill)}
                  style={styles.chip(confirmedSkills.includes(skill))}
                >
                  {confirmedSkills.includes(skill) ? '✓ ' : '+ '} {skill}
                </div>
              ))}
            </div>
            <div style={styles.chipWarning}>
              {confirmedSkills.length}/8 Superpowers Selected
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button 
              type="button" 
              onClick={() => onBack({ targetIndustry, targetRole, confirmedSkills })} 
              style={styles.secondaryButton}
            >
              Back
            </button>
            <button type="submit" style={styles.primaryButton}>
              Continue to Achievements
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}