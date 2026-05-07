import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, BrainCircuit, FileText, ChevronRight, CheckCircle, Video, Star, Target, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // 🔥 PARALLAX ENGINE: Tracks scroll position
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎨 THE MASTER BLUE-GRAY DESIGN SYSTEM
  const styles = {
    page: { fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#0f172a', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
    
    // Navbar
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 5%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontSize: '26px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' },
    logoAccent: { color: '#3b82f6', fontWeight: '900' },
    navButtons: { display: 'flex', gap: '16px' },
    loginBtn: { padding: '10px 20px', backgroundColor: 'transparent', color: '#475569', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '15px' },
    signupBtn: { padding: '10px 20px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },

    // Hero Section (Now with relative positioning for Parallax)
    heroContainer: { position: 'relative', overflow: 'hidden', backgroundColor: '#f8fafc' },
    hero: { position: 'relative', zIndex: 10, padding: '100px 5% 40px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' },
    h1: { fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: '800', color: '#1e293b', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' },
    heroSubtitle: { fontSize: '20px', color: '#475569', lineHeight: '1.6', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' },
    heroButton: { padding: '18px 36px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s ease' },
    
    // Social Proof Avatars
    avatarGroup: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' },
    avatarCluster: { display: 'flex', marginLeft: '10px' },
    avatar: (z, url) => ({ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #f8fafc', marginLeft: '-15px', zIndex: z, backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }),

    // Hero Image Mockup
    heroImageContainer: { position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '60px auto 0', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '1px solid #e2e8f0', overflow: 'hidden', padding: '10px' },
    heroImageInner: { borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', aspectRatio: '16/9', backgroundImage: 'url(https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
    
    // Features Section
    features: { padding: '100px 5%', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', position: 'relative', zIndex: 10 },
    featuresGrid: { display: 'flex', gap: '30px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' },
    card: { flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
    cardIconWrapper: { width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '24px' },
    cardTitle: { fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' },
    cardText: { fontSize: '16px', color: '#64748b', lineHeight: '1.6' },

    // Split Showcase Section
    splitSection: { padding: '100px 5%', backgroundColor: '#f8fafc', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap', position: 'relative', zIndex: 10 },
    splitContent: { flex: '1 1 400px' },
    splitImage: { flex: '1 1 400px', position: 'relative' },
    splitImageMain: { width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', objectFit: 'cover', aspectRatio: '4/5' },
    badge: { position: 'absolute', bottom: '-20px', left: '-20px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px' },

    // Bottom CTA
    cta: { padding: '100px 5%', backgroundColor: '#0f172a', textAlign: 'center', color: '#ffffff', backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', position: 'relative', zIndex: 10 },
    ctaH2: { fontSize: '40px', fontWeight: '800', marginBottom: '20px' },
    ctaText: { fontSize: '18px', color: '#94a3b8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' },
    
    footer: { padding: '30px 5%', backgroundColor: '#020617', color: '#475569', textAlign: 'center', fontSize: '14px', position: 'relative', zIndex: 10 }
  };

  return (
    <div style={styles.page}>
      
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <BrainCircuit size={28} color="#3b82f6" />
          <span>Resu<span style={styles.logoAccent}>ME</span></span>
        </div>
        <div style={styles.navButtons}>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>Log In</button>
          <button onClick={() => navigate('/login')} style={styles.signupBtn}>Sign Up</button>
        </div>
      </nav>

      {/* PARALLAX HERO SECTION */}
      <div style={styles.heroContainer}>
        {/* Parallax Orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(248,250,252,0) 70%)', transform: `translateY(${scrollY * 0.3}px)`, pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(248,250,252,0) 70%)', transform: `translateY(${scrollY * 0.15}px)`, pointerEvents: 'none', zIndex: 1 }} />
        
        <header style={styles.hero}>
          <h1 style={styles.h1}>Don't just list your jobs. <br />Showcase <span style={{ color: '#3b82f6' }}>who you are.</span></h1>
          <p style={styles.heroSubtitle}>
            Stop agonizing over bullet points. Build an AI-optimized resume, attach a professional video introduction, and let the real you shine through to recruiters.
          </p>
          <button onClick={() => navigate('/builder')} style={styles.heroButton} className="hover-scale">
            Build Your ResuME for Free <ChevronRight size={20} />
          </button>
          
          {/* Social Proof */}
          <div style={styles.avatarGroup}>
            <div style={styles.avatarCluster}>
              <div style={styles.avatar(3, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80')} />
              <div style={styles.avatar(2, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80')} />
              <div style={styles.avatar(1, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80')} />
              <div style={styles.avatar(0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80')} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', color: '#f59e0b', gap: '2px', marginBottom: '2px' }}>
                <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
              </div>
              <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Loved by 10,000+ job seekers</span>
            </div>
          </div>
        </header>

        {/* HUGE HERO MOCKUP */}
        <div style={{ padding: '0 5%' }}>
          <div style={styles.heroImageContainer}>
            <div style={{ display: 'flex', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fca5a5' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fcd34d' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#86efac' }}></div>
            </div>
            <div style={styles.heroImageInner}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <h3 style={{ color: 'white', fontSize: '24px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>App Interface Placeholder</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTING THE "ME" */}
      <section style={styles.splitSection}>
        <div style={styles.splitContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: '700', marginBottom: '16px', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Video size={18} /> Put a face to the name
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', lineHeight: '1.2' }}>Bring your experience to life with a Video Pitch.</h2>
          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: '1.7', marginBottom: '32px' }}>
            Recruiters look at paper resumes for an average of 6 seconds. When you attach a recorded introduction to your ResuME, you instantly become a person, not just a PDF. 
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontWeight: '500' }}>
              <CheckCircle size={20} color="#10b981" /> Record directly from your phone or webcam
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontWeight: '500' }}>
              <CheckCircle size={20} color="#10b981" /> AI lighting and background studio filters
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontWeight: '500' }}>
              <CheckCircle size={20} color="#10b981" /> Increases interview callback rates by up to 40%
            </li>
          </ul>
        </div>
        <div style={styles.splitImage}>
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" alt="Professional Woman" style={styles.splitImageMain} />
          <div style={styles.badge}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <PlayCircle size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '18px' }}>"Hi, I'm Sarah!"</div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>Click to play introduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section style={styles.features}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>Everything you need to land the job.</h2>
        </div>
        
        <div style={styles.featuresGrid}>
          <div style={styles.card} className="feature-card">
            <div style={styles.cardIconWrapper}><FileText size={32} /></div>
            <h3 style={styles.cardTitle}>Smart ATS Formatting</h3>
            <p style={styles.cardText}>Our AI Engine perfectly formats your experience using the STAR method, ensuring your achievements pass through automated screening systems.</p>
          </div>
          <div style={styles.card} className="feature-card">
            <div style={styles.cardIconWrapper}><BrainCircuit size={32} /></div>
            <h3 style={styles.cardTitle}>AI Career Coaching</h3>
            <p style={styles.cardText}>Get an instant analysis of your background. Discover high-probability role matches and identify the critical skills you need to secure top-tier offers.</p>
          </div>
          <div style={styles.card} className="feature-card">
            <div style={styles.cardIconWrapper}><Target size={32} /></div>
            <h3 style={styles.cardTitle}>Tailored Objectives</h3>
            <p style={styles.cardText}>Dynamically shift your resume's focus based on the exact title and industry you are targeting to ensure maximum relevance.</p>
          </div>
        </div>
      </section>

      {/* 🚀 NEW PRICING SECTION */}
      <section style={{ padding: '100px 5%', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Invest in your career trajectory.</h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Choose the tier that matches your professional ambition.</p>
        </div>

        <div style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
          
          {/* Standard Tier */}
          <div style={{ flex: '1 1 250px', backgroundColor: '#f8fafc', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#64748b', marginBottom: '12px' }}>Standard</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$0<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#94a3b8" /> AI Resume Generation</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#94a3b8" /> 3 Premium Layouts</li>
            </ul>
            <button style={{ width: '100%', padding: '14px', backgroundColor: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Start Free</button>
          </div>

          {/* Pro Tier */}
          <div style={{ flex: '1 1 250px', backgroundColor: '#f8fafc', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>Pro</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$3<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Video Letters of Rec</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> 5-Image Accomplishment Gallery</li>
            </ul>
            <button style={{ width: '100%', padding: '14px', backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Go Pro</button>
          </div>

          {/* Coach Tier (Most Popular) */}
          <div className="pricing-popular" style={{ flex: '1 1 270px', backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '24px', border: '2px solid #3b82f6', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)' }}>
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#3b82f6', color: '#ffffff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>Most Popular</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Coach</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$7<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Advanced AI Coaching Paths</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Glassdoor Company Match</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#3b82f6" /> Live Voice Interview Coach</li>
            </ul>
            <button style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s' }}>Upgrade to Coach</button>
          </div>

          {/* Premium Tier */}
          <div style={{ flex: '1 1 250px', backgroundColor: '#f8fafc', padding: '40px 30px', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#8b5cf6', marginBottom: '12px' }}>Premium</h3>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e293b', marginBottom: '24px', letterSpacing: '-1px' }}>$9<span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '500' }}>/mo</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#8b5cf6" /> Interview Scenario Library</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '15px' }}><CheckCircle2 size={18} color="#8b5cf6" /> Wage Negotiation Guides</li>
            </ul>
            <button style={{ width: '100%', padding: '14px', backgroundColor: '#f3e8ff', color: '#8b5cf6', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Get Premium</button>
          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaH2}>Ready to upgrade your career?</h2>
        <p style={styles.ctaText}>Join the professionals using ResuME to stand out, get interviews, and negotiate better offers.</p>
        <button onClick={() => navigate('/builder')} style={{...styles.heroButton, backgroundColor: '#ffffff', color: '#0f172a' }} className="hover-scale">
          Get Started Now
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} ResuME. All rights reserved.</p>
      </footer>

      {/* Hover Effects & Media Queries */}
      <style>{`
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); }
        .hover-scale:hover { transform: scale(1.02); }
        @media (min-width: 1024px) {
          .pricing-popular { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}