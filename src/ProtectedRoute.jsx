import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Using the same icon from your Dashboard!

export default function ProtectedRoute({ user, isLoading, children }) {
  const location = useLocation();

  // 1. If Firebase is still figuring out who the user is, show a spinner
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <Loader2 size={40} color="#3b82f6" className="spin-animation" />
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '600' }}>Verifying access...</p>
        <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. If we are sure they are NOT logged in, kick them to the login page
  if (!user) {
    // The "state" part remembers where they were trying to go, so we can send them back after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If they are logged in, open the door and let them see the page!
  return children;
}