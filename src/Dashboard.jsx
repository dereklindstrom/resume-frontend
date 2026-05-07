import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FileText, Plus, LogOut, Clock, Target, Briefcase, Trash2, Loader2, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 THE FETCHER: Reaches into Firestore to grab the user's saved data
  useEffect(() => {
    const fetchSavedResumes = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

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

        // Sort by newest first in memory
        fetchedResumes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setResumes(fetchedResumes);

      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedResumes();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevents the card click from triggering
    if (window.confirm("Are you sure you want to delete this profile?")) {
      await deleteDoc(doc(db, "resumes", id));
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  const handleOpenResume = (resumeData) => {
    // Navigates to the builder and passes the saved data so it loads instantly!
    navigate('/builder', { state: { editData: resumeData } });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
          <BrainCircuit size={28} color="#3b82f6" />
          <span>Resu<span style={{ color: '#3b82f6', fontWeight: '900' }}>ME</span></span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={handleSignOut} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      {/* DASHBOARD CONTENT */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
        
        {/* Header Area */}
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

        {/* Loading State */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#3b82f6' }}>
            <Loader2 size={40} className="spin-animation" />
            <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '600' }}>Loading your profiles...</p>
            <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          
          /* The Grid */
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
                    <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={14} /> {resume.userData?.objective?.targetIndustry || "General"}
                    </div>
                    <button onClick={(e) => handleDelete(e, resume.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', lineHeight: '1.3' }}>
                    {resume.userData?.objective?.targetRole || "Executive Professional"}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                    <Briefcase size={14} /> {resume.userData?.baseline?.name || "Anonymous Profile"}
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