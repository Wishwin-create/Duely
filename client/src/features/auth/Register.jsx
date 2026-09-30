import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authStore';

export default function Register() {
  const register = useAuth((s) => s.register);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
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
        <p className="text-slate-500 text-sm">Create your account</p>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}

        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input name="password" type="password" placeholder="Password (min 8 characters)"
          value={form.password} onChange={onChange} required minLength={8}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <button disabled={busy}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-50">
          {busy ? 'Creating…' : 'Create account'}
        </button>

        <p className="text-sm text-slate-500 text-center">
          Already registered? <Link to="/login" className="text-indigo-600 font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
}