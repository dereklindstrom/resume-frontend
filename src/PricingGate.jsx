import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; 

const STRIPE_PRICES = {
  basic: "price_1TYJ2KFq1iLZWOKqbrEZq8jN",     // $3
  pro: "price_1TYJ2FFq1iLZWOKqrtRIR4ng",         // $7
  executive: "price_1TYJ2JFq1iLZWOKqlblyuhty"   // $9
};

export default function PricingGate() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // 🛣️ PATH 1: User Chooses the Free Tier
  const handleSelectFree = async () => {
    setIsProcessing(true);
    try {
      // 1. Update their database record so we know they picked a plan
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        subscriptionTier: 'free'
      });
      
      // 2. Send them straight into the builder!
      navigate('/builder');
    } catch (error) {
      console.error("Error setting free tier:", error);
      setIsProcessing(false);
    }
  };

  // 💳 PATH 2: User Chooses a Paid Tier
  const handleUpgrade = async (tier) => {
    setIsProcessing(true);
    const priceId = STRIPE_PRICES[tier];

    try {
      // 1. Call your Google Cloud Function to create the checkout session
      const response = await fetch('https://createstripecheckout-u4ujgfkbxa-uc.a.run.app', { // <-- Replace with your actual Cloud Function URL if different!
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId,
          userId: auth.currentUser.uid,
          email: auth.currentUser.email
        })
      });

      const data = await response.json();

      // 2. Redirect them to the secure Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Stripe Error:", error);
      alert("Failed to connect to checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Loader2 size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
        <h2 style={{ marginTop: '20px', color: '#1e293b', fontFamily: 'system-ui' }}>Preparing your workspace...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 5%', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1e293b', marginBottom: '16px', letterSpacing: '-1px' }}>Welcome to ResuME.</h1>
        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Before we hit the canvas, choose the tier that matches your professional ambition.</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* THE FREE TIER */}
        <div style={{ maxWidth: '700px', margin: '0 auto 60px auto', backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Standard Base Plan</h3>
          <div style={{ fontSize: '48px', fontWeight: '900', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$0</div>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '16px', fontWeight: '600' }}><CheckCircle2 size={20} color="#94a3b8" /> AI Resume Generation</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '16px', fontWeight: '600' }}><CheckCircle2 size={20} color="#94a3b8" /> 3 Premium Layouts</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '16px', fontWeight: '600' }}><CheckCircle2 size={20} color="#94a3b8" /> Standard PDF Export</span>
          </div>
          
          <button onClick={handleSelectFree} style={{ padding: '16px 40px', backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.2s' }}>
            Start Building for Free
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Or unlock premium tools</div>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        {/* THE PAID TIERS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
          
          {/* Pro Tier */}
          <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>Pro</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$3</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Video Letters of Rec</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> 5-Image Accomplishment Gallery</li>
            </ul>
            <button onClick={() => handleUpgrade('pro')} style={{ width: '100%', padding: '14px', backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Go Pro</button>
          </div>

          {/* Coach Tier */}
          <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '24px', border: '2px solid #3b82f6', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)', transform: 'scale(1.05)' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3b82f6', color: '#ffffff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>Most Popular</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Coach</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$7</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Advanced AI Coaching Paths</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Glassdoor Company Match</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Live Voice Interview Coach</li>
            </ul>
            <button onClick={() => handleUpgrade('coach')} style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Upgrade to Coach</button>
          </div>

          {/* Premium Tier */}
          <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6', marginBottom: '12px' }}>Premium</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$9</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#8b5cf6" /> Interview Scenario Library</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#8b5cf6" /> Wage Negotiation Guides</li>
            </ul>
            <button onClick={() => handleUpgrade('premium')} style={{ width: '100%', padding: '14px', backgroundColor: '#f3e8ff', color: '#8b5cf6', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Get Premium</button>
          </div>
        </div>
      </div>
    </div>
  );
}