import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { BrainCircuit, Star, LogOut, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  // Listen for auth and tier changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSubscriptionTier(data.subscriptionTier || 'free');
          }
        });
        return () => unsubscribeUser();
      } else {
        setSubscriptionTier('free');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Don't show navbar on the builder canvas if you want it full screen (optional)
  if (location.pathname === '/builder') return null;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 5%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 1000 }}>
      
      {/* LOGO */}
      <div 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer', fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}
      >
        <BrainCircuit size={28} color="#3b82f6" />
        <span>Resu<span style={{ color: '#3b82f6', fontWeight: '900' }}>ME</span></span>
      </div>

      {/* DYNAMIC RIGHT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            {/* Logged In State */}
            {subscriptionTier !== 'free' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: subscriptionTier === 'executive' ? '#ede9fe' : '#fef08a', color: subscriptionTier === 'executive' ? '#5b21b6' : '#854d0e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                <Star size={14} fill="currentColor" /> {subscriptionTier} Member
              </div>
            )}
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={handleSignOut} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </>
        ) : (
          <>
            {/* Logged Out State */}
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={18} /> Sign In
            </button>
            <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}