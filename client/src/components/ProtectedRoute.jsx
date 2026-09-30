import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/authStore';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-slate-500">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}