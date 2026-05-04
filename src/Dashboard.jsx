import { useState, useEffect } from 'react';

const [isLoading, setIsLoading] = useState(false);
const [loadingText, setLoadingText] = useState("Waking up the AI Engine...");

const loadingMessages = [
  "Analyzing your work history...",
  "Extracting leadership metrics...",
  "Writing executive summary...",
  "Formulating career coaching insights...",
  "Polishing the final draft..."
];
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { BrainCircuit, Plus, FileText, Trash2, Link as LinkIcon, LogOut, Video, Clock, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH SAVED RESUMES FROM FIREBASE
  useEffect(() => {
    const fetchResumes = async () => {
      if (!auth.currentUser) return;
      
      try {
        const q = query(
          collection(db, "resumes"), 
          where("userId", "==", auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedResumes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by newest first
        fetchedResumes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setResumes(fetchedResumes);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    // App.jsx will automatically route them back to /login
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "resumes", id));
        setResumes(resumes.filter(resume => resume.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete. Try again.");
      }
    }
  };

  const handleCopyLink = (id) => {
    const publicUrl = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(publicUrl);
    alert("Public link copied to clipboard!");
  };

  const openResume = (resumeData) => {
    // This perfectly hooks into the catcher we already built in App.jsx!
    navigate('/builder', { state: { editData: resumeData } });
  };

  // 🎨 THE MASTER BLUE-GRAY DESIGN SYSTEM
  const styles = {
    page: { backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#0f172a' },
    
    // Navbar
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontSize: '24px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px', cursor: 'pointer' },
    logoAccent: { color: '#3b82f6', fontWeight: '900' },
    navActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    
    // Buttons
    createBtn: { padding: '10px 20px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' },
    signOutBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease' },
    
    // Main Content
    container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 5%' },
    header: { marginBottom: '40px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', letterSpacing: '-1px' },
    subtitle: { fontSize: '16px', color: '#64748b', margin: 0 },

    // Grid Layout
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
    
    // Cards
    card: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
    cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', lineHeight: '1.3' },
    cardIndustry: { fontSize: '13px', color: '#3b82f6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 },
    
    // Badges & Meta
    metaRow: { display: 'flex', gap: '16px', marginBottom: '24px', fontSize: '13px', color: '#64748b', fontWeight: '500' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '4px' },
    mediaBadge: { display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '4px', fontSize: '12px', fontWeight: '600' },

    // Card Actions
    cardActions: { display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
    actionBtn: { flex: 1, padding: '10px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease' },
    deleteBtn: { padding: '10px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },

    // Empty State
    emptyState: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '2px dashed #cbd5e1' },
    emptyIcon: { width: '64px', height: '64px', backgroundColor: '#f1f5f9', color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }
  };

  return (
    <div style={styles.page}>
      {/* Dynamic Hover Styles */}
      <style>{`
        .resume-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); }
        .btn-hover:hover { filter: brightness(0.95); }
      `}</style>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <BrainCircuit size={28} color="#3b82f6" />
          <span>Resu<span style={styles.logoAccent}>ME</span></span>
        </div>
        <div style={styles.navActions}>
          <button onClick={() => navigate('/builder')} style={styles.createBtn} className="btn-hover">
            <Plus size={16} /> Create New
          </button>
          <button onClick={handleSignOut} style={styles.signOutBtn} className="btn-hover">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Resumes</h1>
          <p style={styles.subtitle}>Manage, share, or edit your saved profiles.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your profiles...</div>
        ) : resumes.length === 0 ? (
          
          /* EMPTY STATE */
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FileText size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>No resumes yet</h3>
            <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
              You haven't created any profiles yet. Click the button below to start building your first ResuME.
            </p>
            <button onClick={() => navigate('/builder')} style={{...styles.createBtn, margin: '0 auto', padding: '12px 24px', fontSize: '16px' }}>
              <Plus size={20} /> Create Your First ResuME
            </button>
          </div>

        ) : (

          /* GRID OF SAVED RESUMES */
          <div style={styles.grid}>
            {resumes.map(resume => {
              const dateObj = new Date(resume.createdAt);
              const formattedDate = isNaN(dateObj) ? 'Recently' : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const role = resume.userData?.objective?.targetRole || 'Professional Profile';
              const industry = resume.userData?.objective?.targetIndustry || 'General';
              
              return (
                <div key={resume.id} style={styles.card} className="resume-card">
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.cardTitle}>{role}</h3>
                      <p style={styles.cardIndustry}>{industry}</p>
                    </div>
                  </div>
                  
                  <div style={styles.metaRow}>
                    <div style={styles.metaItem}>
                      <Clock size={14} /> {formattedDate}
                    </div>
                    {resume.media?.hasMedia && resume.media?.mediaType !== 'none' && (
                      <div style={styles.mediaBadge}>
                        <Video size={12} /> Includes Video/Photo
                      </div>
                    )}
                  </div>

                  <div style={styles.cardActions}>
                    <button onClick={() => openResume(resume)} style={styles.actionBtn} className="btn-hover">
                      <ExternalLink size={16} /> View / Edit
                    </button>
                    <button onClick={() => handleCopyLink(resume.id)} style={styles.actionBtn} className="btn-hover">
                      <LinkIcon size={16} /> Copy Link
                    </button>
                    <button onClick={() => handleDelete(resume.id)} style={styles.deleteBtn} className="btn-hover" title="Delete Resume">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        )}
      </div>
    </div>
  );
}