import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { BrainCircuit, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function AuthScreen() {
  const navigate = useNavigate();
  
  // State toggles
  const [isLogin, setIsLogin] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 📧 STANDARD EMAIL/PASSWORD AUTH
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/pricing'); 
      }
    } catch (err) {
      console.error("Auth error:", err);
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

  // 🔵 GOOGLE SIGN IN
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is their very first time logging in
      const { isNewUser } = getAdditionalUserInfo(result);
      
      if (isNewUser) {
        navigate('/pricing'); // Send to pricing gate!
      } else {
        navigate('/dashboard'); // Send to dashboard!
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔑 PASSWORD RESET
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Password reset email sent! Check your inbox.");
      setIsResetting(false);
    } catch (err) {
      console.error("Reset error:", err);
      setError("Failed to send reset email. Make sure the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 STYLES
  const styles = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", padding: '20px' },
    card: { backgroundColor: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.1)', border: '1px solid #e2e8f0' },
    logoContainer: { display: 'flex', justifyContent: 'center', marginBottom: '32px', cursor: 'pointer' },
    logo: { fontSize: '28px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' },
    logoAccent: { color: '#3b82f6', fontWeight: '900' },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
    subtitle: { fontSize: '15px', color: '#64748b', margin: 0 },
    inputGroup: { marginBottom: '20px', position: 'relative' },
    label: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    input: { width: '100%', padding: '14px 16px 14px 44px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease', fontFamily: 'inherit' },
    errorBox: { backgroundColor: '#fef2f2', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' },
    successBox: { backgroundColor: '#ecfdf5', color: '#10b981', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #a7f3d0' },
    primaryButton: { width: '100%', padding: '16px', backgroundColor: '#3b82f6', border: 'none', color: '#ffffff', fontWeight: '700', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 },
    googleButton: { width: '100%', padding: '14px', backgroundColor: '#ffffff', border: '2px solid #e2e8f0', color: '#1e293b', fontWeight: '600', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', opacity: loading ? 0.7 : 1 },
    divider: { display: 'flex', alignItems: 'center', margin: '24px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
    dividerLine: { flex: 1, height: '1px', backgroundColor: '#e2e8f0' },
    toggleLink: { color: '#3b82f6', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', fontSize: 'inherit' }
  };

  return (
    <div style={styles.page}>
      <style>{`
        input:focus { border-color: #3b82f6 !important; background-color: #ffffff !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .google-btn:hover { background-color: #f8fafc !important; border-color: #cbd5e1 !important; }
      `}</style>

      <div style={styles.card}>
        <div style={styles.logoContainer} onClick={() => navigate('/')}>
          <div style={styles.logo}><BrainCircuit size={28} color="#3b82f6" /><span>Resu<span style={styles.logoAccent}>ME</span></span></div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>
            {isResetting ? 'Reset Password' : isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={styles.subtitle}>
            {isResetting ? "We'll send you instructions to reset it." : isLogin ? 'Enter your details to access your dashboard.' : 'Start building your professional profile today.'}
          </p>
        </div>

        {error && <div style={styles.errorBox}><AlertCircle size={18} /><span>{error}</span></div>}
        {successMsg && <div style={styles.successBox}><CheckCircle2 size={18} /><span>{successMsg}</span></div>}

        <form onSubmit={isResetting ? handleResetPassword : handleAuth}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            </div>
          </div>

          {!isResetting && (
            <div style={{ ...styles.inputGroup, marginBottom: '32px' }}>
              <div style={styles.label}>
                <span>Password</span>
                {isLogin && (
                  <button type="button" onClick={() => { setIsResetting(true); setError(''); setSuccessMsg(''); }} style={{ ...styles.toggleLink, fontSize: '13px', fontWeight: '500' }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} minLength={6} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? <><Loader2 size={18} className="spin-icon" /> Please wait...</> : isResetting ? 'Send Reset Link' : isLogin ? 'Log In with Email' : 'Sign Up with Email'}
          </button>
        </form>

        {/* GOOGLE SIGN IN & TOGGLES */}
        {!isResetting && (
          <>
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={{ padding: '0 12px' }}>OR</span>
              <div style={styles.dividerLine}></div>
            </div>

            <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={styles.googleButton} className="google-btn">
              {/* Google SVG Logo */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          {isResetting ? (
            <button type="button" onClick={() => { setIsResetting(false); setError(''); setSuccessMsg(''); }} style={styles.toggleLink}>
              Back to login
            </button>
          ) : (
            <>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }} style={styles.toggleLink}>
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}