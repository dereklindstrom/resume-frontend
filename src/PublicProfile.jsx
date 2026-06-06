import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import FinalResumeView from './FinalResumeView';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'resumes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Loader2 size={48} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '600', fontFamily: 'system-ui' }}>Loading digital profile...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui' }}>
        <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Profile Not Found</h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>This link may be expired, invalid, or the user may have removed their profile.</p>
        <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#38bdf8', color: '#0f172a', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Build Your Own ResuME
        </Link>
      </div>
    );
  }

  // Combine the DB data exactly how FinalResumeView expects it
  const userData = {
    ...data.userData,
    media: data.media
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '40px 20px' }}>
      <FinalResumeView 
        resumeText={data.profileData}
        userData={userData}
        isPublicView={true}
        initialLayout={data.design?.layout || 'signature'}
        initialPalette={data.design?.palette || 'cobalt'}
      />
    </div>
  );
}