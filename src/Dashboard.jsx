import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, where, onSnapshot, doc, getDocs, deleteDoc } from 'firebase/firestore'; 
import { signOut } from 'firebase/auth';
import { FileText, Plus, LogOut, Clock, Target, Briefcase, Trash2, Loader2, BrainCircuit, Star, Check, X, Share2 } from 'lucide-react';

// 🌟 STEP 1: Define your Stripe Price IDs here
const STRIPE_PRICES = {
  basic: "price_1TYJ2KFq1iLZWOKqbrEZq8jN",     // $3
  pro: "price_1TYJ2FFq1iLZWOKqrtRIR4ng",         // $7
  executive: "price_1TYJ2JFq1iLZWOKqlblyuhty"   // $9
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [copiedId, setCopiedId] = useState(null);

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌟 STEP 2: Change state from boolean to tier name
  const [subscriptionTier, setSubscriptionTier] = useState('free'); 
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    // 🕵️ Real-time listener for the user's tier
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Fallback to 'free' if no tier is found
        setSubscriptionTier(data.subscriptionTier || (data.isPremium ? 'pro' : 'free'));
      }
    });

    const fetchResumes = async () => {
      try {
        const q = query(
          collection(db, "resumes"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedResumes = [];
        querySnapshot.forEach((doc) => {
          fetchedResumes.push({ id: doc.id, ...doc.data() });
        });
        fetchedResumes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setResumes(fetchedResumes);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
    return () => unsubscribeUser();
  }, [navigate]);


  // 🚀 THE NEW UPGRADE ENGINE: Now accepts a specific tier
  const handleUpgradeClick = async (selectedTier) => {
    try {
      const priceId = STRIPE_PRICES[selectedTier];
      
      const response = await fetch("https://createstripecheckout-u4ujgfkbxa-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: priceId,
          userId: auth.currentUser.uid,
          tier: selectedTier, // 🌟 Passing the tier to the backend!
          successUrl: window.location.origin + "/dashboard?success=true",
          cancelUrl: window.location.origin + "/dashboard?canceled=true",
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong connecting to Stripe.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this profile?")) {
      await deleteDoc(doc(db, "resumes", id));
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  const handleShare = (e, id) => {
    e.stopPropagation();
    const url = `${window.location.origin}/profile/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Checkmark disappears after 2 seconds
  };

  // 🌟 THE DASHBOARD FIX: Wipe memory before starting a new resume!
  const handleCreateNew = () => {
    sessionStorage.removeItem('resumeStep');
    sessionStorage.removeItem('resumeData');
    sessionStorage.removeItem('resumeFinal');
    setShowPricingModal(false);
    navigate('/builder');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 🛑 PRICING MODAL */}
      {showPricingModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '900px', borderRadius: '24px', padding: '40px', position: 'relative' }}>
            <button onClick={() => setShowPricingModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>Choose Your Plan</h2>
              <p style={{ color: '#64748b' }}>Unlock professional tools to accelerate your career.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* BASIC CARD */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Basic</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', margin: '10px 0' }}>$3 <span style={{ fontSize: '14px', color: '#64748b' }}>/one-time</span></div>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#475569', marginBottom: '20px', flex: 1 }}>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> PDF Export</li>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> 3 Images per item</li>
                </ul>
                <button onClick={() => handleUpgradeClick('basic')} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', cursor: 'pointer' }}>Select Basic</button>
              </div>

              {/* PRO CARD */}
              <div style={{ border: '2px solid #3b82f6', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#f0f9ff' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3b82f6', color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Pro</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', margin: '10px 0' }}>$7 <span style={{ fontSize: '14px', color: '#64748b' }}>/one-time</span></div>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#475569', marginBottom: '20px', flex: 1 }}>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> All Layouts & Colors</li>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> ✨ Power Metrics AI</li>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> AI Coaching Analysis</li>
                </ul>
                <button onClick={() => handleUpgradeClick('pro')} style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Select Pro</button>
              </div>

              {/* EXECUTIVE CARD */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Executive</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', margin: '10px 0' }}>$9 <span style={{ fontSize: '14px', color: '#64748b' }}>/one-time</span></div>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#475569', marginBottom: '20px', flex: 1 }}>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> 10 Images & Video</li>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> Premium Learning Paths</li>
                  <li style={{ marginBottom: '8px' }}><Check size={14} color="#10b981" /> Priority AI Feedback</li>
                </ul>
                <button onClick={() => handleUpgradeClick('executive')} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', cursor: 'pointer' }}>Select Executive</button>
              </div>
            </div>

            {/* 🌟 THE NEW ESCAPE HATCH FOR FREE USERS */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button 
                onClick={handleCreateNew} // 👈 Point this to our new function!
                style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '15px', textDecoration: 'underline' }}
              >
                Skip for now, continue with Free tier
              </button>
            </div>
            
          </div>
        </div>
      )}

    
      {/* REST OF DASHBOARD CONTENT */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
        {isSuccess && (
          <div style={{ backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', padding: '16px', marginBottom: '32px', borderRadius: '0 8px 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🎉</span>
            <div>
              <p style={{ color: '#065f46', fontWeight: '700', margin: '0 0 4px 0' }}>Success!</p>
              <p style={{ color: '#047857', margin: 0, fontSize: '14px' }}>Your account has been upgraded to the {subscriptionTier} tier.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>My Profiles</h1>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Manage your career snapshots.</p>
          </div>
          <button onClick={() => setShowPricingModal(true)} style={{ padding: '14px 24px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create New Resume
          </button>
        </div>

        {isLoading ? (
           <div style={{ textAlign: 'center', padding: '100px' }}><Loader2 className="spin-animation" /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {resumes.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', border: '1px dashed #cbd5e1', borderRadius: '20px' }}>
                <p>No Resumes found. Start building to see them here!</p>
              </div>
            ) : (
              resumes.map((resume) => (
               <div 
                  key={resume.id} 
                  onClick={() => {
                    // 🌟 FIX: Wipe old memory so the saved resume loads perfectly clean!
                    sessionStorage.removeItem('resumeStep');
                    sessionStorage.removeItem('resumeData');
                    sessionStorage.removeItem('resumeFinal');
                    navigate('/builder', { state: { editData: resume } });
                  }}
                  style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} 
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    {resume.media?.hasMedia && resume.media?.publicUrl ? (
                      <img 
                        src={resume.media.publicUrl} 
                        alt="Profile" 
                        style={{ width: '50px', height: '50px', borderRadius: resume.media.shape === 'circle' ? '50%' : '8px', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                        <Briefcase size={20} color="#94a3b8" />
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={(e) => handleShare(e, resume.id)} style={{ background: 'none', border: 'none', color: copiedId === resume.id ? '#10b981' : '#38bdf8', cursor: 'pointer', padding: '4px', transition: 'all 0.2s' }} title="Copy Public Link">
                        {copiedId === resume.id ? <Check size={16} /> : <Share2 size={16} />}
                      </button>
                      <button onClick={(e) => handleDelete(e, resume.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <Target size={12} /> {resume.userData?.objective?.targetIndustry || "General"}
                  </div>
                  
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', lineHeight: '1.3' }}>
                    {resume.userData?.objective?.targetRole || "Executive Professional"}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                    {resume.userData?.baseline?.name || "Anonymous Profile"}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {new Date(resume.createdAt).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={12} /> {resume.design?.layout || "signature"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}