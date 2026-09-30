import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-bold text-indigo-600">Duely</h1>
        <p className="text-slate-500 text-sm">Reset your password</p>

        {sent ? (
          <p className="text-sm text-green-700 bg-green-50 rounded p-3">
            If that email is registered, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}
            <input type="email" placeholder="Your email" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <button disabled={busy}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-50">
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
          </>
        )}

        <p className="text-sm text-center">
          <Link to="/login" className="text-indigo-600 font-medium">Back to log in</Link>
        </p>
      </form>
    </div>
  );
}