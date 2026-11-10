import { useState, useEffect } from 'react';
import { MessageSquare, Video, Globe, Crown, Lock } from 'lucide-react';
import { authenticatePiUser } from '../lib/piConfig';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    authenticatePiUser().then(res => {
      if (res && res.isAuthenticated && res.isAdmin) {
        setIsAdmin(true); 
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0410] text-white flex-col">
        <div className="text-yellow-400 text-5xl font-bold mb-4 animate-pulse">PiSphere</div>
        <p className="text-gray-400">Loading the Future...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xl">π</div>
          <div>
            <h1 className="text-lg font-bold text-yellow-400">PiSphere</h1>
            <p className="text-xs text-gray-400">@RK33 {isAdmin && "👑"}</p>
          </div>
        </div>
        <button className="bg-purple-900 text-white px-3 py-1 rounded-full text-sm">HI ▼</button>
      </header>

      <div className="bg-yellow-600 text-black text-xs p-2 mx-4 rounded flex justify-between font-bold">
        <span>LOCAL AD</span>
        <span>Chat</span>
      </div>

      <main className="p-4">
        {activeTab === 'chats' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-yellow-400 font-bold">SMART CHATS & VIP GROUPS</h2>
              <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm">+ New Group</button>
            </div>
            
            <div className="soft-card p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">🌐 Global Pioneers Hub</h3>
                <p className="text-xs text-gray-400">1420 Pioneers • End-to-End Protected</p>
              </div>
              <button className="text-yellow-400 border border-yellow-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Lock size={14}/> Open</button>
            </div>

            <div className="soft-card p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">🏢 Local Business & Services Network</h3>
                <p className="text-xs text-gray-400">540 Pioneers • End-to-End Protected</p>
              </div>
              <button className="text-yellow-400 border border-yellow-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1"><Lock size={14}/> Open</button>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-4">
            <h2 className="text-white font-bold text-lg">100-User Cloud Meeting Room</h2>
            <div className="flex gap-4">
              <button className="btn-yellow flex-1"><Video size={20}/> Start Meeting</button>
              <button className="bg-purple-800 text-yellow-400 font-bold px-4 py-2 rounded-lg flex-1">👑 Pro Host (2 π)</button>
            </div>
            <div className="soft-card p-4 mt-4">
              <h3 className="text-yellow-400 font-bold mb-2">AI Meeting Summary Vault (0.5 π)</h3>
              <p className="text-sm text-gray-300 mb-4">PiSphere Web3 Launch • 88/100 Pioneers</p>
              <button className="btn-yellow w-full"><Lock size={16}/> Pay 0.5 π to Unlock Summary</button>
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">Social Feed & Services</h2>
              <button className="btn-yellow text-sm py-1">+ Post Offer</button>
            </div>
            <div className="soft-card p-4">
              <h3 className="font-bold text-white">@Sharma_Coaching</h3>
              <p className="text-sm text-gray-300 mt-2">🎓 नया 100-सीट लाइव क्लाउड बैच! फीस: 3 Pi/माह</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-pink-500 text-sm">❤️ 42</span>
                <button className="btn-yellow text-sm py-1">Book Service (3 π)</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="space-y-4">
            <h2 className="text-yellow-400 font-bold text-lg">👑 Super Admin Command Center</h2>
            <div className="soft-card p-4">
              <h3 className="text-white font-bold mb-2">Create Local Ad</h3>
              <input type="text" placeholder="Business Name..." className="w-full bg-black text-white p-2 rounded mb-2 border-none outline-none focus:ring-1 focus:ring-yellow-500"/>
              <button className="btn-yellow w-full">+ Publish Live Ad</button>
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('chats')} className={`flex flex-col items-center ${activeTab === 'chats' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <MessageSquare size={24} />
          <span className="text-xs mt-1">Chats</span>
        </button>
        <button onClick={() => setActiveTab('meetings')} className={`flex flex-col items-center ${activeTab === 'meetings' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <Video size={24} />
          <span className="text-xs mt-1">Meetings</span>
        </button>
        <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center ${activeTab === 'feed' ? 'text-yellow-400' : 'text-gray-400'}`}>
          <Globe size={24} />
          <span className="text-xs mt-1">Feed</span>
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center ${activeTab === 'admin' ? 'text-yellow-400' : 'text-gray-400'}`}>
            <Crown size={24} />
            <span className="text-xs mt-1">Admin</span>
          </button>
        )}
      </nav>
    </div>
  );
}
