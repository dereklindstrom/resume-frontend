import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { BrainCircuit, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthScreen() {
  const navigate = useNavigate();
  
  // State toggles
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Log existing user in
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard'); // 🌟 Returning users go straight to their dashboard
      } else {
        // Create a brand new user
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/pricing'); // 🌟 New users are forced to the Pricing Gate!
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Clean up Firebase's ugly error messages for the user
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🎨 THE MASTER BLUE-GRAY DESIGN SYSTEM
  const styles = {
    page: { 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f8fafc', 
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      padding: '20px'
    },
    card: { 
      backgroundColor: '#ffffff', 
      width: '100%', 
      maxWidth: '420px', 
      borderRadius: '24px', 
      padding: '48px 40px', 
      boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.1)',
      border: '1px solid #e2e8f0'
    },
    logoContainer: { 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '32px',
      cursor: 'pointer'
    },
    logo: { 
      fontSize: '28px', 
      fontWeight: '800', 
      color: '#1e293b', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      letterSpacing: '-0.5px' 
    },
    logoAccent: { 
      color: '#3b82f6', 
      fontWeight: '900' 
    },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { fontSize: '15px', color: '#64748b', margin: 0 },
    
    inputGroup: { marginBottom: '20px', position: 'relative' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    input: { 
      width: '100%', 
      padding: '14px 16px 14px 44px', 
      backgroundColor: '#f8fafc', 
      border: '2px solid #e2e8f0', 
      borderRadius: '12px', 
      fontSize: '15px', 
      color: '#0f172a', 
      outline: 'none', 
      boxSizing: 'border-box', 
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    
    errorBox: { 
      backgroundColor: '#fef2f2', 
      color: '#ef4444', 
      padding: '12px 16px', 
      borderRadius: '8px', 
      fontSize: '14px', 
      fontWeight: '500', 
      marginBottom: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      border: '1px solid #fecaca'
    },

    primaryButton: { 
      width: '100%', 
      padding: '16px', 
      backgroundColor: '#3b82f6', 
      border: 'none', 
      color: '#ffffff', 
      fontWeight: '700', 
      borderRadius: '12px', 
      cursor: loading ? 'not-allowed' : 'pointer', 
      fontSize: '16px', 
      boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)', 
      transition: 'all 0.2s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      opacity: loading ? 0.7 : 1
    },

    toggleText: { 
      textAlign: 'center', 
      marginTop: '24px', 
      fontSize: '14px', 
      color: '#64748b' 
    },
    toggleLink: { 
      color: '#3b82f6', 
      fontWeight: '600', 
      cursor: 'pointer', 
      background: 'none', 
      border: 'none', 
      padding: 0, 
      fontFamily: 'inherit',
      fontSize: 'inherit'
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Tiny CSS snippet to handle input focus states cleanly */}
      <style>{`
        input:focus { border-color: #3b82f6 !important; background-color: #ffffff !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.card}>
        
        {/* Branding */}
        <div style={styles.logoContainer} onClick={() => navigate('/')}>
          <div style={styles.logo}>
            <BrainCircuit size={28} color="#3b82f6" />
            <span>Resu<span style={styles.logoAccent}>ME</span></span>
          </div>
        </div>

        {/* Dynamic Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p style={styles.subtitle}>
            {isLogin ? 'Enter your details to access your dashboard.' : 'Start building your professional profile today.'}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={styles.input} 
              />
            </div>
          </div>

          <div style={{ ...styles.inputGroup, marginBottom: '32px' }}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={styles.input} 
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? (
              <><Loader2 size={18} className="spin-icon" /> Please wait...</>
            ) : (
              isLogin ? 'Log In' : 'Sign Up'
            )}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(''); // Clear errors when flipping views
            }} 
            style={styles.toggleLink}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </div>
  );
}