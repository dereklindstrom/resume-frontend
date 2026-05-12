import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FileText, Plus, LogOut, Clock, Target, Briefcase, Trash2, Loader2, BrainCircuit, Star } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists() && userDocSnap.data().isPremium) {
          setIsPremium(true);
        }

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
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // 🔥 THE UPGRADE ENGINE: Connects your button to Stripe
  const handleUpgradeClick = async () => {
    try {
      const button = document.getElementById('upgrade-btn');
      if (button) button.innerText = "Connecting...";

      const response = await fetch("https://createstripecheckout-u4ujgfkbxa-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1TV0t4CNR4URVUQBoBvHFYDK", // 
          userId: auth.currentUser.uid,
          successUrl: window.location.origin + "/dashboard?success=true",
          cancelUrl: window.location.origin + "/dashboard?canceled=true",
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + data.error);
        if (button) button.innerText = "Upgrade to Premium";
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

  const handleOpenResume = (resumeData) => {
    navigate('/builder', { state: { editData: resumeData } });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
            <BrainCircuit size={28} color="#3b82f6" />
            <span>Resu<span style={{ color: '#3b82f6', fontWeight: '900' }}>ME</span></span>
          </div>
          
          {/* 🔥 THE BUTTON: Swaps between Badge and Buy Button */}
          {isPremium ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              <Star size={14} fill="#eab308" color="#eab308" /> Premium
            </div>
          ) : (
            <button 
              id="upgrade-btn"
              onClick={handleUpgradeClick}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', 
                color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', 
                fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
              }}
            >
              <Star size={14} fill="#eab308" color="#eab308" /> Upgrade to Premium
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={handleSignOut} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      {/* DASHBOARD CONTENT */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
        
        {isSuccess && (
          <div style={{ backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', padding: '16px', marginBottom: '32px', borderRadius: '0 8px 8px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🎉</span>
            <div>
              <p style={{ color: '#065f46', fontWeight: '700', margin: '0 0 4px 0' }}>Upgrade Successful!</p>
              <p style={{ color: '#047857', margin: 0, fontSize: '14px' }}>Your account is now Premium. You have full access to all templates and features.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-1px' }}>My Profiles</h1>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Manage and edit your saved career profiles.</p>
          </div>
          <button 
            onClick={() => navigate('/builder')} 
            style={{ padding: '14px 24px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s' }}
          >
            <Plus size={18} /> Create New Profile
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#3b82f6' }}>
            <Loader2 size={40} className="spin-animation" />
            <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '600' }}>Loading your profiles...</p>
            <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {resumes.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', backgroundColor: '#ffffff', padding: '60px', borderRadius: '20px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>No profiles yet</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Build your first AI-powered resume to see it here.</p>
                <button onClick={() => navigate('/builder')} style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Start Building</button>
              </div>
            ) : (
              resumes.map((resume) => (
                <div 
                  key={resume.id} 
                  onClick={() => handleOpenResume(resume)}
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
                    
                    <button onClick={(e) => handleDelete(e, resume.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
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