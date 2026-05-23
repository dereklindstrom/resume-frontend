import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, isLoading, children }) {
  // 1. If Firebase is still checking their login status, show nothing or a spinner
  if (isLoading) {
    return null; 
  }
  
  // 2. If they are definitely not logged in, kick them to the home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. If they are logged in, let them through to the page!
  return children;
}