'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_LANGUAGES, t } from '@/lib/i18n';
import Splash from '@/components/Splash';

export const AppContext = createContext(null);
export const usePiSphere = () => useContext(AppContext);

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState('hi');
  const [piUser, setPiUser] = useState(null); // Only set after App Studio Step 2 verification
  const [spBalance, setSpBalance] = useState(25);
  const [profile, setProfile] = useState({
    completed: false,
    realName: '',
    mobile: '',
    gmail: '',
    country: 'India',
    state: '',
    city: '',
    visibility: 'public', // 'public' | 'private'
    photoUrl: '',
    warningAccepted: false,
  });

  // 15-second Pi Interstitial Ad state on bottom 4 tab shifts
  const [adState, setAdState] = useState({ active: false, secondsLeft: 15, nextRoute: null });
  const [showInspector, setShowInspector] = useState(false);

  // STEP 1: Initialize Pi SDK v2.0 (no sandbox flag passed)
  useEffect(() => {
    async function initPiSdk() {
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          await window.Pi.init({ version: '2.0' });
        } catch (err) {
          console.error('Pi.init error:', err);
        }
      }
    }
    initPiSdk();
  }, []);

  // STEP 1 + STEP 2 + STEP 3: Authenticate via Pi SDK & verify strictly via App Studio backend
  const handlePiSignIn = async () => {
    try {
      let accessToken = null;
      const onIncompletePaymentFound = (payment) => {
        console.log('Incomplete payment found:', payment);
      };

      if (typeof window !== 'undefined' && window.Pi) {
        await window.Pi.init({ version: '2.0' });
        const authResult = await window.Pi.authenticate(['username'], onIncompletePaymentFound);
        // Strictly keep ONLY accessToken; ignore browser uid & username
        accessToken = authResult?.accessToken;
      }

      if (accessToken) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        });
        if (res.ok) {
          const data = await res.json();
          setPiUser(data.user);
        }
      }
    } catch (err) {
      console.error('Pi sign-in error:', err);
    }
  };

  // Bottom 4 buttons shift -> 15-second Pi Network Ad trigger
  const handleBottomTabShift = (targetRoute) => {
    if (pathname === targetRoute) return;

    // Gate check: if profile is incomplete, redirect to /settings after ad
    const finalDestination =
      !profile.completed && targetRoute !== '/chat' && targetRoute !== '/settings'
        ? '/settings'
        : targetRoute;

    if (typeof window !== 'undefined' && window.Pi?.Ads) {
      try {
        window.Pi.Ads.showAd('interstitial');
      } catch (e) {}
    }

    setAdState({ active: true, secondsLeft: 15, nextRoute: finalDestination });
  };

  useEffect(() => {
    if (!adState.active) return;
    if (adState.secondsLeft <= 0) {
      const dest = adState.nextRoute;
      setAdState({ active: false, secondsLeft: 15, nextRoute: null });
      if (dest) router.push(dest);
      return;
    }
    const timer = setTimeout(() => {
      setAdState((prev) => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [adState, router]);

  const finishAdNow = () => {
    const dest = adState.nextRoute;
    setAdState({ active: false, secondsLeft: 15, nextRoute: null });
    if (dest) router.push(dest);
  };

  return (
    <html lang={lang}>
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>PiSphere — Web3 Super App</title>
      </head>
      <body className="bg-[#05050A] text-zinc-100 font-sans min-h-screen pb-24 select-none overflow-x-hidden">
        {showSplash && <Splash onDone={() => setShowSplash(false)} />}

        {/* 15-Second Pi Interstitial Ad Modal on Tab Shift */}
        {adState.active && (
          <div className="fixed inset-0 z-[9000] bg-[#05050A]/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-sm bg-[#0D0D14] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-md text-[11px] font-semibold text-zinc-200">
                  Pi Ad • {adState.secondsLeft}s
                </span>
                {adState.secondsLeft <= 10 && (
                  <button
                    onClick={finishAdNow}
                    className="px-3 py-1 bg-[#161622] hover:bg-zinc-800 text-xs text-white rounded-lg border border-zinc-700 transition"
                  >
                    {t(lang, 'skipAdBtn')}
                  </button>
                )}
              </div>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#14141F] border border-zinc-700 flex items-center justify-center text-white font-bold text-2xl">
                π
              </div>
              <h3 className="text-base font-bold text-white mb-1">{t(lang, 'adOverlayTitle')}</h3>
              <p className="text-xs text-zinc-400 mb-5">{t(lang, 'adOverlaySub')}</p>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-zinc-200 h-full transition-all duration-1000"
                  style={{ width: `${(adState.secondsLeft / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Anti-Scam Profile Picture Inspector Modal */}
        {showInspector && (
          <div className="fixed inset-0 z-[8500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#0D0D14] border border-zinc-800 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <h4 className="text-sm font-bold text-white">{t(lang, 'inspectorTitle')}</h4>
                <button
                  onClick={() => setShowInspector(false)}
                  className="px-2.5 py-1 bg-[#14141F] text-xs text-zinc-300 rounded-lg border border-zinc-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#14141F] border border-zinc-700 flex items-center justify-center overflow-hidden">
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-zinc-200">
                      {profile.realName ? profile.realName.slice(0, 2).toUpperCase() : 'π'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {profile.realName || (piUser ? `@${piUser.username}` : 'Unverified User')}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {!profile.completed
                      ? t(lang, 'statusScammer')
                      : profile.visibility === 'public'
                      ? t(lang, 'statusVerified')
                      : t(lang, 'statusPrivate')}
                  </div>
                </div>
              </div>

              {profile.completed && profile.visibility === 'public' ? (
                <div className="space-y-1.5 text-xs bg-[#08080E] p-3 rounded-xl border border-zinc-800/80 text-zinc-300">
                  <div><strong className="text-zinc-400">Name:</strong> {profile.realName}</div>
                  <div><strong className="text-zinc-400">Location:</strong> {profile.city}, {profile.state}, {profile.country}</div>
                  <div><strong className="text-zinc-400">Gmail:</strong> {profile.gmail}</div>
                  <div><strong className="text-zinc-400">SP Reward Status:</strong> Eligible (Public Pioneer)</div>
                </div>
              ) : (
                <div className="text-xs bg-[#08080E] p-3 rounded-xl border border-zinc-800 text-zinc-400">
                  {t(lang, 'profileGateNotice')}
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowInspector(false);
                    router.push('/settings');
                  }}
                  className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs text-white rounded-lg border border-zinc-700"
                >
                  ⚙️ Settings / Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOP HEADER: Left (Official Logo + PiSphere) | Right (Profile Pic Icon -> Language -> Pi Sign In) */}
        <header className="sticky top-0 z-50 bg-[#07070C]/95 backdrop-blur-md border-b border-zinc-800/80 px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#14141F] border border-zinc-700 flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
              π
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              {t(lang, 'appName')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Circular Profile Picture Button ONLY (No text label) */}
            <button
              onClick={() => setShowInspector(true)}
              title="Inspect Pioneer Profile"
              className="w-8 h-8 rounded-full bg-[#14141F] hover:bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden transition"
            >
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-bold text-zinc-200">
                  {profile.realName ? profile.realName.slice(0, 2).toUpperCase() : '👤'}
                </span>
              )}
            </button>

            {/* 58-Language Selector Button */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-[#14141F] hover:bg-zinc-800 text-[11px] text-zinc-100 border border-zinc-700 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((item) => (
                <option key={item.code} value={item.code} className="bg-[#0B0B12] text-white">
                  {item.label}
                </option>
              ))}
            </select>

            {/* Dark Obsidian Pi Sign-In Button (Zero Yellow) */}
            <button
              onClick={handlePiSignIn}
              className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs text-white border border-zinc-700 rounded-lg font-semibold transition"
            >
              {piUser ? `@${piUser.username}` : t(lang, 'loginPi')}
            </button>
          </div>
        </header>

        {/* STICKY DARK BLACK LOCAL AD BAR WITH BRIGHT WHITE TEXT */}
        <div className="sticky top-[53px] z-40 bg-[#05050A] border-b border-zinc-800/90 px-3.5 py-1.5 flex items-center gap-2.5 overflow-hidden">
          <span className="px-2 py-0.5 bg-[#14141F] border border-zinc-700 text-[10px] text-white font-bold rounded shrink-0">
            {t(lang, 'localAdBadge')}
          </span>
          <div className="text-xs text-white font-medium truncate">
            {t(lang, 'localAdText')}
          </div>
        </div>

        {/* MAIN ROUTE CONTENT */}
        <AppContext.Provider
          value={{
            lang,
            setLang,
            piUser,
            setPiUser,
            spBalance,
            setSpBalance,
            profile,
            setProfile,
          }}
        >
          <main className="max-w-lg mx-auto p-3.5">{children}</main>
        </AppContext.Provider>

        {/* @RK33 Super Admin Floating Button */}
        {piUser?.role === 'owner' && (
          <button
            onClick={() => router.push('/post?admin=1')}
            className="fixed bottom-16 right-4 z-50 px-3.5 py-2 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-600 rounded-full shadow-xl"
          >
            {t(lang, 'adminPanelBtn')}
          </button>
        )}

        {/* BOTTOM 4 TABS (Every shift triggers 15-second max Pi Network Ad) */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#07070C]/95 backdrop-blur-md border-t border-zinc-800/90 px-3 py-2 flex justify-around items-center max-w-lg mx-auto">
          <button
            onClick={() => handleBottomTabShift('/chat')}
            className={`px-3 py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
              pathname?.startsWith('/chat')
                ? 'bg-[#14141F] text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>💬</span>
            <span>{t(lang, 'chatsTab')}</span>
          </button>

          <button
            onClick={() => handleBottomTabShift('/meeting')}
            className={`px-3 py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
              pathname?.startsWith('/meeting')
                ? 'bg-[#14141F] text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>📹</span>
            <span>{t(lang, 'meetTab')}</span>
          </button>

          <button
            onClick={() => handleBottomTabShift('/post')}
            className={`px-3 py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
              pathname?.startsWith('/post')
                ? 'bg-[#14141F] text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>🌐</span>
            <span>{t(lang, 'postTab')}</span>
          </button>

          <button
            onClick={() => handleBottomTabShift('/wallet')}
            className={`px-3 py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
              pathname?.startsWith('/wallet')
                ? 'bg-[#14141F] text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>👛</span>
            <span>{t(lang, 'walletTab')}</span>
          </button>
        </nav>
      </body>
    </html>
  );
}
