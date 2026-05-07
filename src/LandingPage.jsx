import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, FileText, Video, Target, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* --- NAVIGATION BAR --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText color="#38bdf8" />
          Resu<span style={{ color: '#38bdf8' }}>ME</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#cbd5e1', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/builder')} 
            style={{ padding: '10px 24px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '30px', color: '#38bdf8', fontSize: '14px', fontWeight: '600', marginBottom: '24px', letterSpacing: '1px' }}>
          ✨ The AI-Powered Career Coach
        </div>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: '800', lineHeight: '1.1', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
          Don't just build a resume.<br/>
          <span style={{ color: '#38bdf8' }}>Engineer your next career move.</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 40px auto' }}>
          Go beyond static documents. ResuME uses advanced AI to build dynamic profiles, analyze your skill gaps, and provide actionable coaching to land your target role.
        </p>
        <button 
          onClick={() => navigate('/builder')} 
          style={{ padding: '16px 32px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)', transition: 'transform 0.2s' }}
        >
          Build Your Free Profile <ArrowRight size={20} />
        </button>
      </header>

      {/* --- FEATURES GRID --- */}
      <section style={{ backgroundColor: '#1e293b', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 16px 0' }}>Powerful tools to stand out.</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0 }}>Designed for professionals who want to completely control their narrative.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* Feature 1 */}
            <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '16px', border: '1px solid #334155' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#38bdf8' }}>
                <Video size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Video Recommendations</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>Ditch the outdated reference list. Embed up to 3 video testimonials directly into your digital profile via SMS text links.</p>
            </div>

            {/* Feature 2 */}
            <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '16px', border: '1px solid #334155' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#8b5cf6' }}>
                <BrainCircuit size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Advanced AI Coaching</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>Instantly identify your skill gaps. Our AI maps your history to your target role and builds a custom training program to get you there.</p>
            </div>

            {/* Feature 3 */}
            <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '16px', border: '1px solid #334155' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#22c55e' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 12px 0' }}>Interview Simulations</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>Practice makes perfect. Conduct realistic, voice-based mock interviews with our AI recruiter and get immediate feedback on your tone.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}