import { useState } from 'react';

export default function ExperienceFork({ onSelect, onBack }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Modern, clean layout styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: '#0f172a',
      textAlign: 'center'
    },
    title: {
      fontSize: '24px',
      marginBottom: '32px',
      fontWeight: '600',
      color: '#1e293b'
    },
    cardGrid: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '40px'
    },
    card: (isHovered) => ({
      flex: '1',
      minWidth: '220px',
      backgroundColor: '#ffffff',
      border: isHovered ? '2px solid #4f46e5' : '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '32px 20px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }),
    iconWrapper: {
      marginBottom: '8px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '700',
      margin: '0',
      color: '#0f172a'
    },
    cardSubtitle: {
      fontSize: '14px',
      margin: '0',
      color: '#64748b'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>This helps us tailor your resume structure perfectly.</h2>

      <div style={styles.cardGrid}>
        
        {/* CARD 1: Student / Grad */}
        <div 
          onClick={() => onSelect('Entry Level')}
          onMouseEnter={() => setHoveredCard('grad')}
          onMouseLeave={() => setHoveredCard(null)}
          style={styles.card(hoveredCard === 'grad')}
        >
          <div style={styles.iconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h3 style={styles.cardTitle}>Student / Recent Grad</h3>
          <p style={styles.cardSubtitle}>(Under 1 year experience)</p>
        </div>

        {/* CARD 2: Building Experience */}
        <div 
          onClick={() => onSelect('Mid Level')}
          onMouseEnter={() => setHoveredCard('mid')}
          onMouseLeave={() => setHoveredCard(null)}
          style={styles.card(hoveredCard === 'mid')}
        >
          <div style={styles.iconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
          </div>
          <h3 style={styles.cardTitle}>Building Experience</h3>
          <p style={styles.cardSubtitle}>(1-4 years)</p>
        </div>

        {/* CARD 3: Experienced Pro */}
        <div 
          onClick={() => onSelect('Senior Level')}
          onMouseEnter={() => setHoveredCard('senior')}
          onMouseLeave={() => setHoveredCard(null)}
          style={styles.card(hoveredCard === 'senior')}
        >
          <div style={styles.iconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h3 style={styles.cardTitle}>Experienced Professional</h3>
          <p style={styles.cardSubtitle}>(5+ years)</p>
        </div>

      </div>

      {/* The Back Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button 
          type="button" 
          onClick={onBack} 
          style={{ padding: '12px 24px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', color: '#475569', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s ease' }}
        >
          Back
        </button>
      </div>

    </div>
  );
}