'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [username, setUsername]       = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading]         = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setUsername(localStorage.getItem('username') || 'User');
    fetchStats(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchStats(token) {
    const res = await fetch('/api/chat', {
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    if (data.messages) {
      const userMsgs = data.messages.filter(m => m.role === 'user');
      setMessageCount(userMsgs.length);
    }
    setLoading(false);
  }

  const joinDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f2027, #0a3d4a)' }}>
      <div className="text-cyan-300 text-xl animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #0a3d4a 50%, #0f2027 100%)' }}>

      {/* Glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #0891b2, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl p-8 border border-white/10 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

          {/* Avatar */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center
              text-4xl font-bold text-white mx-auto mb-4 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
              {username[0]?.toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-white">{username}</h1>
            {/* ✅ FIXED: Uncle Chat → ChatFlow */}
            <p className="text-cyan-300 text-sm mt-1">ChatFlow Member 🌊</p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl p-4 text-center border border-white/10"
              style={{ background: 'rgba(8,145,178,0.15)' }}>
              <p className="text-3xl font-bold text-cyan-400">{messageCount}</p>
              <p className="text-slate-400 text-xs mt-1">Messages Sent</p>
            </div>
            <div className="rounded-2xl p-4 text-center border border-white/10"
              style={{ background: 'rgba(6,182,212,0.15)' }}>
              {/* ✅ FIXED: ■ → ✅ emoji */}
              <p className="text-lg font-bold text-cyan-400">Active ✅</p>
              <p className="text-slate-400 text-xs mt-1">Account Status</p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3 mb-8">
            {[
              /* ✅ FIXED: ■ → proper emojis */
              ['👤 Username',       username],
              ['📅 Member Since',   joinDate],
              ['💬 Messages Sent',  messageCount + ' messages'],
            ].map(([label, value]) => (
              <div key={label}
                className="flex justify-between items-center px-4 py-3
                  rounded-xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-slate-400 text-sm">{label}</span>
                <span className="text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Link href="/chat"
              className="flex-1 py-3 rounded-xl text-white font-semibold
                text-sm text-center transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
              ← Back to Chat
            </Link>
            <button
              onClick={() => { localStorage.clear(); router.push('/login'); }}
              className="px-4 py-3 rounded-xl text-red-400 font-semibold
                text-sm border border-red-400/30 hover:bg-red-400/10 transition-colors">
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}