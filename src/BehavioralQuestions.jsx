import { useState } from 'react';

export default function BehavioralQuestions({ targetIndustry, targetRole, savedData, onComplete, onBack }) {
  const [stories, setStories] = useState(
    savedData || { story1: '', story2: '' }
  );

  const handleChange = (e) => {
    setStories({ ...stories, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(stories);
  };

  // 🧠 THE DYNAMIC QUESTION ENGINE
  const getQuestions = () => {
    const role = (targetRole || '').toLowerCase();
    const industry = (targetIndustry || '').toLowerCase();

    // 1. Leadership & Management
    if (role.includes('manager') || role.includes('lead') || role.includes('director') || role.includes('vp')) {
      return [
        "Tell me about a time you led a team through a difficult transition or missed target.",
        "Describe a time you had to coach an underperforming employee. What was the outcome?"
      ];
    } 
    // 2. Sales & Revenue
    else if (role.includes('sales') || role.includes('account') || role.includes('business development')) {
      return [
        "Tell me about your most challenging closed deal and how you navigated the negotiation.",
        "Describe a time you had to quickly pivot your strategy to hit a revenue goal."
      ];
    } 
    // 3. Tech & Engineering
    else if (role.includes('developer') || role.includes('engineer') || industry.includes('tech')) {
      return [
        "Tell me about a time you had to learn a complex new technology under a tight deadline.",
        "Describe a time you disagreed with a technical or architectural decision. How did you handle it?"
      ];
    } 
    // 4. Finance & Banking
    else if (industry.includes('finance') || industry.includes('banking') || role.includes('analyst')) {
      return [
        "Tell me about a time you used data to identify a major risk or opportunity.",
        "Describe a time you had to explain a complex financial concept to a non-technical stakeholder."
      ];
    }
    // 5. Default Universal Questions
    return [
      "Tell me about a time you solved a complex problem or overcame a major challenge.",
      "Describe a time you went above and beyond to deliver exceptional results."
    ];
  };

  const [question1, question2] = getQuestions();

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
    
    // Modern Flexbox Header
    sectionHeader: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      marginBottom: '16px', 
      marginTop: '32px', 
      borderBottom: '2px solid #f1f5f9', 
      paddingBottom: '12px' 
    },
    sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 },
    
    inputGroup: { marginBottom: '24px' },
    label: { display: 'block', fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
    subLabel: { display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '500' },
    
    textarea: {
      width: '100%', padding: '16px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0',
      borderRadius: '12px', fontSize: '16px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
      transition: 'all 0.2s ease', fontFamily: 'inherit', minHeight: '140px', resize: 'vertical',
      lineHeight: '1.5'
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
          <h2 style={styles.title}>Let's dig into your achievements.</h2>
          <p style={styles.subtitle}>
            {targetRole ? `Tell us why you are the perfect fit for a ${targetRole}.` : "Show off your biggest wins."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div>
            <div style={styles.sectionHeader}>
              {/* ✨ Modern Trophy SVG Icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
              <h3 style={styles.sectionTitle}>Behavioral Questions</h3>
            </div>
            
            <div style={styles.inputGroup}>
              {/* 🚨 Use the dynamic question here! */}
              <label style={styles.label}>1. {question1}</label>
              <span style={styles.subLabel}>Use the STAR method: Situation, Task, Action, Result. Focus on the impact you made.</span>
              <textarea 
                required 
                name="story1"
                value={stories.story1} 
                onChange={handleChange} 
                style={styles.textarea} 
                placeholder="The situation was... My task was to... I took action by... The result was..." 
              />
            </div>

            <div style={styles.inputGroup}>
              {/* 🚨 Use the dynamic question here! */}
              <label style={styles.label}>2. {question2}</label>
              <span style={styles.subLabel}>Mention specific metrics, revenue grown, time saved, or feedback received.</span>
              <textarea 
                required 
                name="story2"
                value={stories.story2} 
                onChange={handleChange} 
                style={styles.textarea} 
                placeholder="I noticed an opportunity to... I implemented... This resulted in..." 
              />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <button 
              type="button" 
              onClick={() => onBack(stories)} 
              style={styles.secondaryButton}
            >
              Back
            </button>
            <button type="submit" style={styles.primaryButton}>
              Continue to Video
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}