'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!form.email || !form.password)
      return setError('Please fill all fields');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...form }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) return setError(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      router.push('/chat');
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f1f1a 0%, #0d2b22 50%, #0f1f1a 100%)' }}>

      {/* Background glow blobs — GREEN theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Glass card */}
        <div className="rounded-3xl p-8 border shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(16,185,129,0.2)'
          }}>

          {/* Header */}
          <div className="text-center mb-8">

            {/* Logo icon — green */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center
              text-3xl mx-auto mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              🔐
            </div>

            {/* CHATFLOW heading */}
            <h1 className="text-5xl font-black text-white tracking-[0.3em] mb-2"
              style={{ textShadow: '0 0 30px rgba(16,185,129,0.8), 0 0 60px rgba(5,150,105,0.4)' }}>
              CHATFLOW
            </h1>

            {/* Green divider line */}
            <div className="w-24 h-0.5 mx-auto my-3 rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }} />

            <p className="text-slate-300 text-sm font-medium">Welcome Back!</p>
            <p className="text-slate-500 text-xs mt-1">Login to your account 👋</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300
              border border-red-500/30"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">

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
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-xl text-white text-sm
                  outline-none border transition-all placeholder-slate-600"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(16,185,129,0.2)',
                }}
              />
            </div>

            {/* Password field with show/hide */}
            <div>
              <label className="text-slate-400 text-xs font-medium mb-2
                block tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white text-sm
                    outline-none border transition-all placeholder-slate-600"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(16,185,129,0.2)',
                  }}
                />
                {/* 👁️ Show/Hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-slate-400 hover:text-white transition-colors text-lg">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Login button — green */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold
                text-sm transition-all disabled:opacity-50 mt-2 shadow-lg"
              style={{ background: loading
                ? 'rgba(16,185,129,0.5)'
                : 'linear-gradient(135deg, #10b981, #059669)' }}>
              {loading ? '⏳ Logging in...' : '🔓 Login'}
            </button>
          </div>

          <p className="text-slate-400 text-sm text-center mt-6">
            No account?{' '}
            <Link href="/signup"
              className="font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#10b981' }}>
              Sign Up →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}