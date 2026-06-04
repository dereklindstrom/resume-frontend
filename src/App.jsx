import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; 

// --- PAGES & COMPONENTS ---
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import AuthScreen from './AuthScreen';
import PublicProfile from './PublicProfile';
import ProtectedRoute from './ProtectedRoute';
import PricingGate from './PricingGate';

// --- BUILDER STEPS ---
import BaselineForm from './BaselineForm';
import ExperienceFork from './ExperienceFork';
import ExperienceDetails from './ExperienceDetails';
import ObjectiveForm from './ObjectiveForm';
import BehavioralQuestions from './BehavioralQuestions';
import VideoStep from './VideoStep'; 
import FinalResumeView from './FinalResumeView';
import { generateResumeAPI } from './AIEngine';

// 🔥 Progress Bar Component
const ProgressBar = ({ currentStep, setStep }) => { 
  const steps = [
    { num: 1, label: "Basics" },
    { num: 2, label: "Experience" },
    { num: 3, label: "Work History" },
    { num: 4, label: "Target Role" },
    { num: 5, label: "Achievements" },
    { num: 6, label: "Video" }
  ];

  if (currentStep >= 7) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto 30px auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '35%', left: 0, right: 0, height: '3px', backgroundColor: '#e2e8f0', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '35%', left: 0, width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, height: '3px', backgroundColor: '#38bdf8', zIndex: 1, transition: 'width 0.4s ease' }} />
        
        {steps.map((step) => {
          const isActive = currentStep === step.num;
          const isPast = currentStep > step.num;
          return (
            <div 
              key={step.num} 
              onClick={() => setStep(step.num)}
              style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: isActive || isPast ? '#38bdf8' : '#f8fafc', border: `3px solid ${isActive || isPast ? '#38bdf8' : '#e2e8f0'}`, color: isActive || isPast ? '#0f172a' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: isActive ? '0 0 0 4px rgba(56, 189, 248, 0.2)' : 'none' }}>
                {isPast ? '✓' : step.num}
              </div>
              <span style={{ fontSize: '12px', fontWeight: isActive ? '700' : '500', color: isActive ? '#0f172a' : '#64748b' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 🔥 The Main Builder Application
function BuilderFlow({ isPremium, subscriptionTier }) { 
  // 🧠 1. Load from memory, or start fresh if memory is empty
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('resumeStep');
    return saved ? parseInt(saved) : 1;
  });
  
  const [userData, setUserData] = useState(() => {
    const saved = sessionStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : { experienceLevel: 'Mid Level' };
  });

  const [finalResume, setFinalResume] = useState(() => {
    return sessionStorage.getItem('resumeFinal') || '';
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [loadingText, setLoadingText] = useState("Waking up the AI Engine...");

  // 🧠 2. Every time they type, click next, or generate... save it to memory instantly!
  useEffect(() => {
    sessionStorage.setItem('resumeStep', step.toString());
    sessionStorage.setItem('resumeData', JSON.stringify(userData));
    sessionStorage.setItem('resumeFinal', finalResume);
  }, [step, userData, finalResume]);
  
  const loadingMessages = [
    "Analyzing your work history...",
    "Extracting leadership metrics...",
    "Writing executive summary...",
    "Formulating career coaching insights...",
    "Polishing the final draft..."
  ];

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.editData) {
      const savedResume = location.state.editData;
      setUserData({
        baseline: savedResume.userData?.baseline,
        experienceDetails: savedResume.userData?.experienceDetails,
        objective: savedResume.userData?.objective,
        media: savedResume.media
      });
      setFinalResume(savedResume.profileData);
      setStep(7);
    }
  }, [location]);

  // 🔥 NEW: Safely wipe the memory and start over
  const handleReset = () => {
    // 1. Wipe the browser's temporary storage
    sessionStorage.removeItem('resumeStep');
    sessionStorage.removeItem('resumeData');
    sessionStorage.removeItem('resumeFinal');

    // 2. Clear out the location state (in case they came from the Dashboard "Edit" button)
    window.history.replaceState({}, document.title);

    // 3. Reset the live React state to trigger a fresh start
    setUserData({ experienceLevel: 'Mid Level' });
    setFinalResume('');
    setEditId(null);
    setStep(1); 
  };

  const handleBaselineComplete = (data) => { setUserData({ ...userData, baseline: data }); setStep(2); };
  const handleExperienceSelect = (level) => { setUserData({ ...userData, experienceLevel: level }); setStep(3); };
  const handleDetailsComplete = (details) => { setUserData({ ...userData, experienceDetails: details }); setStep(4); };
  const handleObjectiveComplete = (objectiveData) => { setUserData({ ...userData, objective: objectiveData }); setStep(5); };
  const handleStoriesComplete = (stories) => { setUserData({ ...userData, stories: stories }); setStep(6); };

  const handleVideoComplete = async (videoData) => {
    const finalProfile = { ...userData, media: videoData };
    setUserData(prev => ({ ...prev, media: videoData }));
    setStep(7); 
    setIsGenerating(true);
    setLoadingText(loadingMessages[0]);

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2500);

   try {
    let aiResponse = await generateResumeAPI(finalProfile, isPremium); 
    setFinalResume(aiResponse);
  } catch (error) {
      console.error("AI Generation failed:", error);
      alert("The AI engine took too long. Please click Regenerate.");
    } finally {
      clearInterval(messageInterval);
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const aiResponse = await generateResumeAPI(userData, isPremium); 
    setFinalResume(aiResponse);
    } catch (error) {
      console.error("Failed to regenerate:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <ProgressBar currentStep={step} setStep={setStep} />
      {step === 1 && <BaselineForm savedData={userData.baseline} onComplete={handleBaselineComplete} />}      
      {step === 2 && <ExperienceFork onSelect={handleExperienceSelect} onBack={() => setStep(step - 1)} />}
      {step === 3 && (
        <ExperienceDetails 
          level={userData.experienceLevel} 
          savedData={userData.experienceDetails} 
          onComplete={handleDetailsComplete} 
          onBack={() => setStep(2)} 
          subscriptionTier={subscriptionTier}
        />
      )}
      {step === 4 && <ObjectiveForm workHistory={userData.experienceDetails?.workHistory} savedData={userData.objective} onComplete={handleObjectiveComplete} onBack={() => setStep(3)} />}
      {step === 5 && <BehavioralQuestions onComplete={handleStoriesComplete} onBack={() => setStep(step - 1)} />}
      {step === 6 && <VideoStep onComplete={handleVideoComplete} onBack={() => setStep(step - 1)} />}
      
      {step === 7 && (
        <>
          {isGenerating ? (
             <div style={{ textAlign: 'center', marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '60px', height: '60px', border: '6px solid #e2e8f0', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
               <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
               <h3 style={{ marginTop: '25px', fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>{loadingText}</h3>
             </div>
          ) : (
            <FinalResumeView 
              resumeText={finalResume} 
              userData={userData} 
              editId={editId} 
              onReset={handleReset} 
              onRegenerate={handleRegenerate} 
              isGenerating={isGenerating}
              isPremium={isPremium} 
              subscriptionTier={subscriptionTier}
              onEditMedia={() => setStep(6)} // 👈 ADD THIS ONE NEW LINE!
            />
          )}
        </>
      )}
    </div>
  );
}

// 🔥 The Global App Router
export default function App() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('free'); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsPremium(data.isPremium || false);
            setSubscriptionTier(data.subscriptionTier || (data.isPremium ? 'pro' : 'free'));
          }
          setIsLoading(false); 
        });

        return () => {
          unsubscribeDoc();
          unsubscribeAuth();
        };
      } else {
        setIsPremium(false);
        setSubscriptionTier('free');
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '600', fontFamily: 'system-ui' }}>Verifying session...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      {/* 🌟 Global Navbar placed securely inside the Router but outside the page Routes */}
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/pricing" element={<PricingGate />} />
        
        {/* Make sure this is exactly "/builder" */}
        <Route 
          path="/builder" 
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <BuilderFlow isPremium={isPremium} subscriptionTier={subscriptionTier} /> 
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all throws lost users to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}