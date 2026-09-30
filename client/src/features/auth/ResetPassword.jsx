import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match');
    setBusy(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      navigate('/login', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      setError(data?.issues?.[0]?.message || data?.error || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-bold text-indigo-600">Duely</h1>
        <p className="text-slate-500 text-sm">Choose a new password</p>

        {!token && <p className="text-sm text-red-600 bg-red-50 rounded p-2">This reset link is missing its token.</p>}
        {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}

        <input type="password" placeholder="New password (min 8 characters)" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={8}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input type="password" placeholder="Confirm new password" value={confirm}
          onChange={(e) => setConfirm(e.target.value)} required minLength={8}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <button disabled={busy || !token}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-50">
          {busy ? 'Saving…' : 'Reset password'}
        </button>

        <p className="text-sm text-center">
          <Link to="/login" className="text-indigo-600 font-medium">Back to log in</Link>
        </p>
      </form>
    </div>
  );
}