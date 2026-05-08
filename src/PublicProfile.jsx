import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import FinalResumeView from './FinalResumeView';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PublicProfile() {
  const { profileId } = useParams(); // Grabs the ID from the URL
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProfile = async () => {
    console.log("Searching for ID:", profileId); // 👈 Log 1
    try {
      const docRef = doc(db, "resumes", profileId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Data found:", docSnap.data()); // 👈 Log 2
        setProfileData(docSnap.data());
      } else {
        console.log("No document found in Firestore!");
        setError("This profile doesn't exist.");
      }
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError("Something went wrong while loading this profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <Loader2 size={48} color="#3b82f6" className="spin-animation" />
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '600' }}>Loading ResuME...</p>
        <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', textAlign: 'center' }}>
        <AlertCircle size={48} color="#ef4444" />
        <h2 style={{ color: '#1e293b', marginTop: '16px' }}>Oops!</h2>
        <p style={{ color: '#64748b' }}>{error}</p>
      </div>
    );
  }

  // 🔥 THE MAGIC: We reuse your existing FinalResumeView!
  // We pass it the data from the database and set a "publicMode" flag
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingBottom: '50px' }}>
      <FinalResumeView 
        resumeText={profileData.profileData} 
        
        /* 🔥 THE FIX: Merge the media object into the userData so the resume can see it! */
        userData={{ ...profileData.userData, media: profileData.media }} 
        
        isPublicView={true} 
      />
      
      {/* Small subtle branding footer for recruiters */}
      <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '13px' }}>
        Powered by <strong style={{ color: '#3b82f6' }}>ResuME</strong>
      </div>
    </div>
  );
}