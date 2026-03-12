'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StatsPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchStats(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchStats(token) {
    const res  = await fetch('/api/chat', {
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    if (data.messages) {
      const all      = data.messages;
      const userMsgs = all.filter(m => m.role === 'user');
      const botMsgs  = all.filter(m => m.role === 'bot');

      // Most used word
      const allWords = userMsgs
        .map(m => m.content.toLowerCase().split(' '))
        .flat()
        .filter(w => w.length > 2);
      const wordCount = {};
      allWords.forEach(w => { wordCount[w] = (wordCount[w] || 0) + 1; });
      const topWord = Object.entries(wordCount)
        .sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';

      // Most active hour
      const hours = userMsgs.map(m =>
        new Date(m.createdAt).getHours()
      );
      const hourCount = {};
      hours.forEach(h => { hourCount[h] = (hourCount[h] || 0) + 1; });
      const topHour = Object.entries(hourCount)
        .sort((a,b) => b[1]-a[1])[0]?.[0];
      const activeTime = topHour
        ? (topHour < 12 ? topHour + ' AM' : topHour - 12 + ' PM')
        : 'N/A';

      setStats({
        total:    all.length,
        userMsgs: userMsgs.length,
        botMsgs:  botMsgs.length,
        topWord,
        activeTime,
        avgPerDay: userMsgs.length > 0
          ? (userMsgs.length / 1).toFixed(0)
          : 0,
      });
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f2027, #0a3d4a)' }}>
      <div className="text-cyan-300 text-xl animate-pulse">
        Loading stats...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #0a3d4a 50%, #0f2027 100%)' }}>

      {/* Glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #0891b2, transparent)' }} />
      </div>

      <div className="relative max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center
            text-3xl mx-auto mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
            📊
          </div>
          <h1 className="text-5xl font-black text-white tracking-[0.3em] mb-2"
            style={{ textShadow: '0 0 30px rgba(6,182,212,0.8)' }}>
            CHATFLOW
          </h1>
          <div className="w-24 h-0.5 mx-auto my-3 rounded-full"
            style={{ background: 'linear-gradient(90deg, #0891b2, #06b6d4)' }} />
          <p className="text-cyan-300 text-sm font-medium">Your Chat Statistics 📊</p>
        </div>

        {/* Big stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Total messages */}
          <div className="rounded-2xl p-6 border border-white/10 text-center"
            style={{ background: 'rgba(8,145,178,0.15)' }}>
            <p className="text-5xl font-black text-cyan-400 mb-1">
              {stats?.total || 0}
            </p>
            <p className="text-slate-400 text-sm">Total Messages</p>
            <p className="text-cyan-500 text-xs mt-1">All time 🌊</p>
          </div>

          {/* Your messages */}
          <div className="rounded-2xl p-6 border border-white/10 text-center"
            style={{ background: 'rgba(6,182,212,0.15)' }}>
            <p className="text-5xl font-black text-cyan-400 mb-1">
              {stats?.userMsgs || 0}
            </p>
            <p className="text-slate-400 text-sm">Your Messages</p>
            <p className="text-cyan-500 text-xs mt-1">You sent 💬</p>
          </div>

          {/* Bot replies */}
          <div className="rounded-2xl p-6 border border-white/10 text-center"
            style={{ background: 'rgba(8,145,178,0.15)' }}>
            <p className="text-5xl font-black text-cyan-400 mb-1">
              {stats?.botMsgs || 0}
            </p>
            <p className="text-slate-400 text-sm">Bot Replies</p>
            <p className="text-cyan-500 text-xs mt-1">Bot sent 🤖</p>
          </div>

          {/* Most active time */}
          <div className="rounded-2xl p-6 border border-white/10 text-center"
            style={{ background: 'rgba(6,182,212,0.15)' }}>
            <p className="text-3xl font-black text-cyan-400 mb-1">
              {stats?.activeTime || 'N/A'}
            </p>
            <p className="text-slate-400 text-sm">Most Active</p>
            <p className="text-cyan-500 text-xs mt-1">Your peak time ⏰</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="rounded-2xl border border-white/10 overflow-hidden mb-6"
          style={{ background: 'rgba(255,255,255,0.03)' }}>

          {[
            ['🔤 Most Used Word',    stats?.topWord || 'N/A'],
            ['💬 Messages You Sent', stats?.userMsgs + ' messages'],
            ['🤖 Bot Replies',       stats?.botMsgs + ' messages'],
            ['📊 Total Conversation',stats?.total + ' messages total'],
          ].map(([label, value], i) => (
            <div key={i}
              className="flex justify-between items-center px-6 py-4 border-b border-white/5
                last:border-0">
              <span className="text-slate-400 text-sm">{label}</span>
              <span className="text-white text-sm font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* Progress bar — you vs bot */}
        <div className="rounded-2xl p-6 border border-white/10 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-white text-sm font-bold mb-3">
            💬 You vs 🤖 Bot
          </p>
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full transition-all duration-1000"
              style={{
                width: stats?.total > 0
                  ? (stats.userMsgs / stats.total * 100) + '%'
                  : '50%',
                background: 'linear-gradient(90deg, #0891b2, #06b6d4)'
              }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-cyan-400 text-xs">
              You {stats?.total > 0
                ? Math.round(stats.userMsgs/stats.total*100)
                : 0}%
            </span>
            <span className="text-slate-400 text-xs">
              Bot {stats?.total > 0
                ? Math.round(stats.botMsgs/stats.total*100)
                : 0}%
            </span>
          </div>
        </div>

        {/* Back button */}
        <Link href="/chat"
          className="block w-full py-4 rounded-2xl text-white font-bold
            text-sm text-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
          ← Back to Chat
        </Link>

      </div>
    </div>
  );
}