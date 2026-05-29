import { useState, useEffect } from 'react';

export default function BaselineForm({ savedData, onComplete }) {
  const [name, setName] = useState(savedData?.name || '');
  const [email, setEmail] = useState(savedData?.email || '');
  const [phone, setPhone] = useState(savedData?.phone || '');
  const [location, setLocation] = useState(savedData?.location || '');
  const [linkedin, setLinkedin] = useState(savedData?.linkedin || '');

  // 🌟 NEW: This forces the form to update if it finds memory data!
  useEffect(() => {
    if (savedData) {
      setName(savedData.name || '');
      setEmail(savedData.email || '');
      setPhone(savedData.phone || '');
      setLocation(savedData.location || '');
      setLinkedin(savedData.linkedin || '');
    }
  }, [savedData]);
  
  const [formData, setFormData] = useState(
    savedData || { name: '', email: '', phone: '', location: '', linkedin: '' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  // 🎨 THE MASTER BLUE-GRAY DESIGN SYSTEM
  // You can copy/paste this exact styles object into your other forms!
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: '#0f172a', // Dark Slate
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0', // Light Slate Border
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)', // Soft blue-gray shadow
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b', // Deep Slate
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b', // Medium Slate
      margin: '0'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569', // Blue-Gray
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      backgroundColor: '#f8fafc', // Very light blue-gray background
      border: '2px solid #e2e8f0', // Slate border
      borderRadius: '12px',
      fontSize: '16px',
      color: '#0f172a',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px'
    },
    primaryButton: {
      flex: 1,
      padding: '16px 24px',
      backgroundColor: '#3b82f6', // Bright Modern Blue
      border: 'none',
      color: '#ffffff',
      fontWeight: '600',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)', // Blue glow
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Let's start with the basics.</h2>
          <p style={styles.subtitle}>Where can recruiters reach you?</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="e.g., Jane Doe" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="jane@example.com" />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Phone Number</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} placeholder="(555) 123-4567" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Location</label>
              <input required type="text" name="location" value={formData.location} onChange={handleChange} style={styles.input} placeholder="City, State" />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>LinkedIn URL (Optional)</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} style={styles.input} placeholder="linkedin.com/in/janedoe" />
            </div>
          </div>

          <div style={styles.buttonContainer}>
            {/* Step 1 has no Back button, so the Continue button takes up the full width */}
            <button type="submit" style={styles.primaryButton}>
              Continue to Experience
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
