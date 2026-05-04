import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Analytics } from "@vercel/analytics/next"

// --- PAGES & COMPONENTS ---
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import AuthScreen from './AuthScreen';
import PublicResumeView from './PublicResumeView';

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
              <span style={{ fontSize: '12px', fontWeight: isActive ? '700' : '500', color: isActive ? '#0f172a' : '#64748b', display: window.innerWidth < 600 && !isActive ? 'none' : 'block' }}>
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
function BuilderFlow() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({ experienceLevel: 'Mid Level' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalResume, setFinalResume] = useState('');
  const [editId, setEditId] = useState(null); 
  
  // 🔥 NEW: State for dynamic loading text
  const [loadingText, setLoadingText] = useState("Waking up the AI Engine...");
  
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
    setLoadingText(loadingMessages[0]); // Reset text

    // Start cycling through messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2500);

    try {
      let aiResponse = await generateResumeAPI(finalProfile);
      if (!aiResponse || aiResponse.trim() === '') {
        console.log("AI returned empty, attempting auto-retry...");
        aiResponse = await generateResumeAPI(finalProfile);
      }
      setFinalResume(aiResponse);
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("The AI engine took too long to respond. Please click Regenerate.");
    } finally {
      clearInterval(messageInterval); // Stop the timer!
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setLoadingText(loadingMessages[0]); // Reset text

    // Start cycling through messages for regeneration too
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2500);

    try {
      const aiResponse = await generateResumeAPI(userData);
      setFinalResume(aiResponse);
    } catch (error) {
      console.error("Failed to regenerate:", error);
      alert("Error connecting to AI. Please ensure the backend is running.");
    } finally {
      clearInterval(messageInterval); // Stop the timer!
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      
      <ProgressBar currentStep={step} setStep={setStep} />

      {step === 1 && <BaselineForm onComplete={handleBaselineComplete} />}
      
      {step === 2 && <ExperienceFork onSelect={handleExperienceSelect} onBack={() => setStep(step - 1)} />}
      
      {step === 3 && <ExperienceDetails 
        level={userData.experienceLevel} 
        savedData={userData.experienceDetails} 
        onComplete={handleDetailsComplete} 
        onBack={(partialData) => { 
          setUserData(prev => ({ ...prev, experienceDetails: partialData })); 
          setStep(2); 
        }} 
      />}
      
      {step === 4 && <ObjectiveForm 
        workHistory={userData.experienceDetails?.workHistory} 
        savedData={userData.objective} 
        onComplete={handleObjectiveComplete} 
        onBack={(partialData) => { 
          setUserData(prev => ({ ...prev, objective: partialData })); 
          setStep(3); 
        }} 
      />}
      
      {step === 5 && <BehavioralQuestions 
        targetIndustry={userData.objective?.targetIndustry} 
        targetRole={userData.objective?.targetRole} 
        workHistory={userData.experienceDetails?.workHistory} 
        onComplete={handleStoriesComplete} 
        onBack={() => setStep(step - 1)} 
      />}
      
      {step === 6 && <VideoStep onComplete={handleVideoComplete} onBack={() => setStep(step - 1)} />}

      {step === 7 && (
        <>
          {isGenerating ? (
             <div style={{ textAlign: 'center', marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               {/* Built-in CSS Spinner */}
               <div style={{ width: '60px', height: '60px', border: '6px solid #e2e8f0', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
               <style>
                 {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
               </style>
               {/* Dynamic Text */}
               <h3 style={{ marginTop: '25px', fontSize: '22px', fontWeight: 'bold', color: '#0f172a', transition: 'opacity 0.3s ease-in-out' }}>
                 {loadingText}
               </h3>
             </div>
          ) : (
            <FinalResumeView 
              resumeText={finalResume} 
              userData={userData} 
              editId={editId}
              onReset={() => window.location.reload()} 
              onRegenerate={handleRegenerate}    
              isGenerating={isGenerating}        
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (isCheckingAuth) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/p/:id" element={<PublicResumeView />} />
      
      {/* Auth Screen (Redirects to dashboard if already logged in) */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthScreen />} />
      
      {/* Protected Routes (Requires Login) */}
      <Route path="/builder" element={user ? <BuilderFlow /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}