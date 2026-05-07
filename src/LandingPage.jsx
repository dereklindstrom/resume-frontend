import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, FileText, Video, Target, TrendingUp, CheckCircle2, Star, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // 🔥 THE PARALLAX ENGINE: Tracks how far down the user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      
      {/* --- PARALLAX HERO SECTION (Vibrant Dark Blue) --- */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a192f', overflow: 'hidden' }}>
        
        {/* Parallax Background Layer 1 (Slowest) */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(10,25,47,0) 70%)', transform: `translateY(${scrollY * 0.2}px)`, pointerEvents: 'none' }} />
        
        {/* Parallax Background Layer 2 (Medium) */}
        <div style={{ position: 'absolute', top: '40%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(10,25,47,0) 70%)', transform: `translateY(${scrollY * 0.4}px)`, pointerEvents: 'none' }} />

        {/* Navigation */}
        <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
          <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
            <FileText color="#38bdf8" fill="rgba(56,189,248,0.2)" size={28} />
            Resu<span style={{ color: '#38bdf8' }}>ME</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#cbd5e1', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '15px', transition: 'color 0.2s' }}>Log In</button>
            <button onClick={() => navigate('/builder')} style={{ padding: '10px 24px', backgroundColor: '#38bdf8', color: '#0a192f', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)', transition: 'transform 0.2s' }}>Get Started <ArrowRight size={16} /></button>
          </div>
        </nav>

        {/* Hero Content (Moves slightly up as you scroll down) */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px', transform: `translateY(${scrollY * -0.1}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '30px', color: '#38bdf8', fontSize: '14px', fontWeight: '700', marginBottom: '30px', letterSpacing: '1px' }}>
            <Zap size={16} fill="#38bdf8" /> The AI-Powered Career Coach
          </div>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 72px)', fontWeight: '800', lineHeight: '1.05', margin: '0 0 24px 0', letterSpacing: '-1.5px', color: '#ffffff', maxWidth: '900px' }}>
            Don't just build a resume.<br/>
            <span style={{ color: '#38bdf8' }}>Engineer your next move.</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            Go beyond static documents. ResuME uses advanced AI to build dynamic profiles, analyze your skill gaps, and provide actionable coaching to land your target role.
          </p>
          <button onClick={() => navigate('/builder')} style={{ padding: '18px 40px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.5)', transition: 'all 0.2s' }}>
            Build Your Free Profile <ArrowRight size={20} />
          </button>
        </div>

        {/* The Angled Transition to the white section */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', backgroundColor: '#ffffff', clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)', zIndex: 10 }} />
      </div>

      {/* --- BRIGHT FEATURES SECTION --- */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-1px' }}>Tools designed to make you stand out.</h2>
            <p style={{ fontSize: '18px', color: '#64748b', margin: 0, maxWidth: '600px', margin: '0 auto' }}>A completely new way to showcase your professional narrative, backed by data.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {/* Feature Cards */}
            {[
              { icon: <Video size={28} />, color: '#38bdf8', bg: '#e0f2fe', title: 'Video Letters of Rec', desc: 'Ditch the outdated reference list. Send an SMS link to your peers and embed up to 3 video testimonials directly into your digital profile.' },
              { icon: <Target size={28} />, color: '#8b5cf6', bg: '#ede9fe', title: 'Actionable AI Coaching', desc: 'Instantly identify your skill gaps. Our AI maps your history to your target role and builds a custom training program to get you there.' },
              { icon: <TrendingUp size={28} />, color: '#22c55e', bg: '#dcfce7', title: 'Live Interview Simulator', desc: 'Practice makes perfect. Conduct realistic, voice-based mock interviews with our AI recruiter and get immediate feedback on your tone.' }
            ].map((feat, i) => (
              <div key={i} style={{ padding: '40px', borderRadius: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '60px', height: '60px', backgroundColor: feat.bg, color: feat.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>{feat.title}</h3>
                <p style={{ color: '#475569', lineHeight: '1.6', margin: 0, fontSize: '16px' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section style={{ backgroundColor: '#f8fafc', padding: '100px 20px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-1px' }}>Invest in your career trajectory.</h2>
            <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>Choose the tier that matches your ambition.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
            
            {/* Standard Tier */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#64748b', margin: '0 0 15px 0' }}>Standard</h3>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', letterSpacing: '-2px' }}>$0<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#22c55e" /> AI Resume Generation</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#22c55e" /> 3 Premium Layouts</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#22c55e" /> Standard PDF Export</li>
              </ul>
              <button onClick={() => navigate('/builder')} style={{ width: '100%', padding: '14px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Start Free</button>
            </div>

            {/* Pro Tier (Highlighted) */}
            <div style={{ backgroundColor: '#0f172a', padding: '40px 30px', borderRadius: '20px', border: '2px solid #38bdf8', transform: 'scale(1.05)', boxShadow: '0 20px 40px rgba(15,23,42,0.2)' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#38bdf8', color: '#0f172a', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>Most Popular</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#38bdf8', margin: '0 0 15px 0' }}>Pro Builder</h3>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#ffffff', marginBottom: '20px', letterSpacing: '-2px' }}>$3<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '15px' }}><CheckCircle2 size={20} color="#38bdf8" /> Everything in Standard</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '15px' }}><CheckCircle2 size={20} color="#38bdf8" /> Video Letters of Rec</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#cbd5e1', fontSize: '15px' }}><CheckCircle2 size={20} color="#38bdf8" /> 5-Image Accomplishment Gallery</li>
              </ul>
              <button style={{ width: '100%', padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Upgrade to Pro</button>
            </div>

            {/* Elite Tier */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6', margin: '0 0 15px 0' }}>Career Coach</h3>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', letterSpacing: '-2px' }}>$7<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#8b5cf6" /> Everything in Pro</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#8b5cf6" /> Advanced AI Coaching Paths</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#8b5cf6" /> Glassdoor Company Alignment</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#8b5cf6" /> Live Voice Interview Coach</li>
              </ul>
              <button style={{ width: '100%', padding: '14px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Upgrade to Coach</button>
            </div>

            {/* Premium Tier */}
            <div style={{ backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b', margin: '0 0 15px 0' }}>Premium</h3>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', letterSpacing: '-2px' }}>$9<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#f59e0b" /> Everything in Coach</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#f59e0b" /> Interview Scenario Library</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={20} color="#f59e0b" /> Wage Negotiation Guides</li>
              </ul>
              <button style={{ width: '100%', padding: '14px', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Get Premium</button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}