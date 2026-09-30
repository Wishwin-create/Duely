import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authStore';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold">Hi, {user.name} 👋</h1>
        <p className="text-slate-500 mt-1">{user.email}</p>
        <p className="mt-6 text-slate-600">Your Today view will live here.</p>
        <button onClick={onLogout}
          className="mt-6 border rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
          Log out
        </button>
      </div>
    </div>
  );
}