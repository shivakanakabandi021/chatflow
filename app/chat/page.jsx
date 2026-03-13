'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EMOJIS = [
  '😀','😂','😍','🥰','😎','🤔','😅','🤣',
  '😊','🥳','😜','🤩','😇','🙏','👍','👎',
  '❤️','🔥','✨','💯','🎉','👏','💪','🤝',
  '😢','😭','😤','🤯','😱','🥺','😴','🤗',
  '🍕','🍔','☕','🎮','📱','💻','🚀','⭐',
  '🌊','🎵','🏆','💡','❓','✅','❌','⚡',
];

export default function ChatPage() {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [username, setUsername]       = useState('');
  const [search, setSearch]           = useState('');
  const [showSearch, setShowSearch]   = useState(false);
  const [showEmoji, setShowEmoji]     = useState(false);
  const bottomRef = useRef(null);
  const router    = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setusername(localStorage.getItem('username') || 'User');
    // ✅ fetchHistory REMOVED = fresh chat every login!
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;
    const token   = localStorage.getItem('token');
    const msgText = input.trim();
    setInput('');
    setShowEmoji(false);
    setMessages(prev => [...prev, {
      role: 'user', content: msgText, createdAt: new Date().toISOString()
    }]);
    setLoading(true);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ message: msgText }),
    });
    if (res.status === 401) { router.push('/login'); return; }
    const data = await res.json();
    setMessages(prev => [...prev, {
      role: 'bot', content: data.reply || 'Error!',
      createdAt: new Date().toISOString()
    }]);
    setLoading(false);
  }

  function clearChat() {
    setMessages([]);
  }

  function addEmoji(emoji) {
    setInput(prev => prev + emoji);
  }

  const filteredMessages = search.trim()
    ? messages.filter(m =>
        m.content.toLowerCase().includes(search.toLowerCase()))
    : messages;

  function formatTime(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="flex flex-col h-screen"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #0a3d4a 50%, #0f2027 100%)' }}>

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0
        border-b border-white/10"
        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center
            text-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
            🤖
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">
              ChatFlow Bot
            </h1>
            <p className="text-cyan-300 text-xs">Hello, {username}! 👋</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowSearch(!showSearch); setSearch(''); }}
            className="p-2 rounded-lg text-slate-400 hover:text-white
              border border-white/10 hover:bg-white/10 transition-colors text-sm">
            🔍
          </button>
          <Link href="/profile"
            className="p-2 rounded-lg text-slate-400 hover:text-white
              border border-white/10 hover:bg-white/10 transition-colors text-sm">
            👤
          </Link>
          <Link href="/stats"
            className="p-2 rounded-lg text-slate-400 hover:text-white
              border border-white/10 hover:bg-white/10 transition-colors text-sm">
            📊
          </Link>
          <button onClick={clearChat}
            className="px-3 py-1.5 rounded-lg text-amber-400
              border border-amber-400/30 hover:bg-amber-400/10
              text-xs font-medium transition-colors">
            Clear
          </button>
          <button
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="px-3 py-1.5 rounded-lg text-red-400
              border border-red-400/30 hover:bg-red-400/10
              text-xs font-medium transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-white/10 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search messages..."
            autoFocus
            className="w-full px-4 py-2 rounded-xl text-white text-sm
              outline-none border border-white/10
              focus:border-cyan-500/60 focus:ring-2
              focus:ring-cyan-500/20 placeholder-slate-600"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          {search && (
            <p className="text-cyan-400 text-xs mt-1 px-1">
              Found {filteredMessages.length} message(s)
            </p>
          )}
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-3xl flex items-center
              justify-center text-4xl mb-4"
              style={{ background: 'rgba(6,182,212,0.2)' }}>
              🤖
            </div>
            <p className="text-white font-semibold text-lg">
              {search ? 'No messages found' : "Hi! I'm ChatFlow Bot 👋"}
            </p>
            <p className="text-cyan-300/60 text-sm mt-1">
              {search ? 'Try a different search term' : 'Ask ChatFlow Bot something...'}
            </p>
          </div>
        )}

        {filteredMessages.map((msg, i) => (
          <div key={i}
            className={'flex items-end gap-2 ' +
              (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center
                text-sm flex-shrink-0 mb-5"
                style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                🤖
              </div>
            )}
            <div className={'flex flex-col ' +
              (msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={'px-4 py-2.5 rounded-2xl text-sm max-w-xs lg:max-w-md ' +
                (msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'text-slate-100 border border-white/10 rounded-bl-sm')}
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }
                  : { background: 'rgba(255,255,255,0.08)' }}>
                {msg.content}
              </div>
              <span className="text-slate-600 text-xs mt-1 px-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center
                text-xs font-bold text-white flex-shrink-0 mb-5"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                {username[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
              🤖
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-white/10"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="flex space-x-1">
                {[0, 0.15, 0.3].map((d, i) => (
                  <div key={i}
                    style={{ animationDelay: d + 's' }}
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div className="px-4 py-3 border-t border-white/10 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="grid grid-cols-8 gap-1 max-w-4xl mx-auto">
            {EMOJIS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => addEmoji(emoji)}
                className="text-xl p-1.5 rounded-lg hover:bg-white/10
                  transition-colors text-center">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
        <div className="flex gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="px-3 py-3 rounded-xl text-xl transition-all border border-white/10
              hover:bg-white/10"
            style={{ background: showEmoji
              ? 'rgba(6,182,212,0.2)'
              : 'rgba(255,255,255,0.05)' }}>
            😀
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask ChatFlow Bot something..."
            className="flex-1 px-4 py-3 rounded-xl text-white text-sm
              outline-none border border-white/10
              focus:border-cyan-500/60 focus:ring-2
              focus:ring-cyan-500/20 placeholder-slate-600"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl text-white text-sm font-semibold
              transition-all disabled:opacity-40 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
            Send ➤
          </button>
        </div>
      </div>
    </div>
  );
}