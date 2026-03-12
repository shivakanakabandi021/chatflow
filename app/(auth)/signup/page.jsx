'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    // ✅ FIX 2: Validation runs FIRST before anything else
    if (!form.username || !form.email || !form.password)
      return setError('Please fill all fields');

    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', ...form }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.error || 'Signup failed');
      }

      router.push('/login');

    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Background glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="rounded-3xl p-8 border border-white/10 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center
              text-3xl mx-auto mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
              💬
            </div>

            <h1 className="text-5xl font-black text-white tracking-[0.3em] mb-2"
              style={{ textShadow: '0 0 30px rgba(99,102,241,0.8), 0 0 60px rgba(59,130,246,0.4)' }}>
              CHATFLOW
            </h1>

            <div className="w-24 h-0.5 mx-auto my-3 rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #3b82f6)' }} />

            <p className="text-slate-300 text-sm font-medium">Create your account</p>
            <p className="text-slate-500 text-xs mt-1">Join ChatFlow today 🚀</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300
              border border-red-500/30"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">

            {/* Username field */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-2
                block tracking-wide uppercase">
                Username
              </label>
              <input
                type="text"
                placeholder="cooluser123"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                className="w-full px-4 py-3 rounded-xl text-white text-sm
                  outline-none border border-white/10 transition-all
                  focus:border-indigo-500/60 focus:ring-2
                  focus:ring-indigo-500/20 placeholder-slate-600"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* Email field */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-2
                block tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                className="w-full px-4 py-3 rounded-xl text-white text-sm
                  outline-none border border-white/10 transition-all
                  focus:border-indigo-500/60 focus:ring-2
                  focus:ring-indigo-500/20 placeholder-slate-600"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* ✅ FIX 1: Password field with show/hide toggle */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-2
                block tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="min 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white text-sm
                    outline-none border border-white/10 transition-all
                    focus:border-indigo-500/60 focus:ring-2
                    focus:ring-indigo-500/20 placeholder-slate-600"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                {/* 👁️ Show / Hide button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-slate-400 hover:text-white transition-colors text-lg">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {/* ✅ FIX 2: Live hint shown while typing */}
              {form.password.length > 0 && form.password.length < 6 && (
                <p className="text-red-400 text-xs mt-1 px-1">
                  ⚠️ Password must be at least 6 characters
                  ({form.password.length}/6)
                </p>
              )}
              {form.password.length >= 6 && (
                <p className="text-green-400 text-xs mt-1 px-1">
                  ✅ Password looks good!
                </p>
              )}
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold
                text-sm transition-all disabled:opacity-50 mt-2 shadow-lg"
              style={{ background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
              {loading ? '⏳ Creating account...' : '🚀 Sign Up'}
            </button>
          </div>

          <p className="text-slate-400 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium">
              Login →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}