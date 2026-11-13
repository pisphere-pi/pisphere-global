'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePiSphere } from '@/app/layout';
import { clean } from '@/lib/sanitize';

const POST_TEXT = {
  hi: {
    feedHeader: 'सोशल पोस्ट फीड और लोकल सर्विसेज (X-Pattern)',
    likeRule: 'नियम: पोस्ट पर 100 Likes पूरे होते ही +1 Sphere Point (SP) सीधे लेखक के Pi यूज़रनेम वॉलेट में जुड़ जाता है।',
    newPostPh: 'पायनियर्स के साथ नया अपडेट या सर्विस साझा करें...',
    publishBtn: 'पोस्ट करें ➤',
    likeBtn: '❤️ लाइक',
    sim100LikesBtn: '⚡ +100 Likes (+1 SP टेस्ट)',
    tipBtn: '💸 SP टिप',
    adminToggleBtn: '👑 @RK33 एडमिन कमांड सेंटर',
    adminTitle: '👑 @RK33 सुपर एडमिन: रीडिमेड इमेज विज्ञापन और SP ट्रेजरी',
    uploadAdLabel: '📷 रीडिमेड विज्ञापन पोस्टर/इमेज अपलोड करें (गैलरी से)',
    chooseAdImg: '🖼️ विज्ञापन इमेज चुनें',
    removeImgBtn: '✕ इमेज हटाएं',
    modeFullPoster: '🖼️ केवल रीडिमेड पोस्टर (Full Image View)',
    modeImgText: '🖼️+📝 इमेज + शीर्षक टेक्स्ट',
    launchAdBtn: '🚀 मेन व्यू पर 4s लॉक्ड विज्ञापन चलाएं',
    maxSpSupplyLabel: 'अधिकतम Sphere Points (SP) सप्लाई नियंत्रण:',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  },
  en: {
    feedHeader: 'Social Post Feed & Local Services (X-Pattern)',
    likeRule: 'Rule: Every 100 Likes on a post automatically credits +1 Sphere Point (SP) to the author’s Pi username wallet.',
    newPostPh: 'Share an update or local service with Pioneers...',
    publishBtn: 'Publish ➤',
    likeBtn: '❤️ Like',
    sim100LikesBtn: '⚡ +100 Likes (+1 SP Test)',
    tipBtn: '💸 Tip SP',
    adminToggleBtn: '👑 @RK33 Admin Command Center',
    adminTitle: '👑 @RK33 Super Admin: Readymade Image Ad & SP Treasury',
    uploadAdLabel: '📷 Upload Readymade Ad Poster/Image (From Gallery)',
    chooseAdImg: '🖼️ Select Ad Image',
    removeImgBtn: '✕ Remove Image',
    modeFullPoster: '🖼️ Readymade Poster Only (Full View)',
    modeImgText: '🖼️+📝 Image + Headline Text',
    launchAdBtn: '🚀 Launch 4s Locked Ad on Main View',
    maxSpSupplyLabel: 'Maximum Sphere Points (SP) Supply Control:',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  }
};

// Built-in SVG Poster Presets for 1-Click Admin Testing
const PRESET_BANNERS = [
  {
    id: 'preset-1',
    label: '🎨 Preset 1: Pi Mega Meet',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="#090912"/><circle cx="500" cy="80" r="140" fill="#181828"/><text x="40" y="110" fill="#FFFFFF" font-family="sans-serif" font-size="30" font-weight="bold">PiSphere Global Mega Meet</text><text x="40" y="160" fill="#10B981" font-family="sans-serif" font-size="20" font-weight="bold">100-User HD Cloud Room • Earn SP</text><text x="40" y="230" fill="#A1A1AA" font-family="sans-serif" font-size="16">Join Verified Pioneers Live @ 6:00 PM IST</text></svg>`
      )
  },
  {
    id: 'preset-2',
    label: '🎨 Preset 2: Local Pi Store',
    dataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="#070B12"/><text x="40" y="115" fill="#FFFFFF" font-family="sans-serif" font-size="30" font-weight="bold">Verified Local Pi Merchants</text><text x="40" y="165" fill="#34D399" font-family="sans-serif" font-size="20" font-weight="bold">Book Coaching, Doctors & Stores with π</text><text x="40" y="230" fill="#D4D4D8" font-family="sans-serif" font-size="16">100% Anti-Scam Verified Public Profiles</text></svg>`
      )
  }
];

export default function PostFeedPage() {
  const router = useRouter();
  const { lang, piUser, spBalance, setSpBalance, profile } = usePiSphere();
  const tx = POST_TEXT[lang] || POST_TEXT.hi;

  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Sharma_Coaching',
      content: 'New Web3 & Pi SDK Live Batch starting this evening! 100 Likes = +1 SP active on all Pioneer posts.',
      likes: 99,
      spEarned: 0,
      pinned: true,
      posterImage: '',
      time: '15m ago'
    },
    {
      id: 'post-2',
      author: 'Dr_Verma_Pi',
      content: 'Verified Tele-Consultation available for Pioneers. Tap or hold my @username to tip SP or inspect profile.',
      likes: 200,
      spEarned: 2,
      pinned: false,
      posterImage: '',
      time: '1h ago'
    }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [holdTargetPost, setHoldTargetPost] = useState(null);
  const [tipTargetUser, setTipTargetUser] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [toast, setToast] = useState('');

  // @RK33 Admin Panel + Readymade Image Template Ad State
  const [showAdminBox, setShowAdminBox] = useState(false);
  const [adImageDataUrl, setAdImageDataUrl] = useState(PRESET_BANNERS[0].dataUrl);
  const [adDisplayMode, setAdDisplayMode] = useState('full_poster'); // 'full_poster' | 'image_text'
  const [adTitle, setAdTitle] = useState('PiSphere Official Sponsored Broadcast');
  const [adPopup, setAdPopup] = useState({ open: false, lockSeconds: 4 });
  const [maxSpSupply, setMaxSpSupply] = useState(100000000);

  const postHoldTimer = useRef(null);
  const userHoldTimer = useRef(null);

  // Strict Profile Gate
  useEffect(() => {
    if (!profile?.completed) {
      router.replace('/settings');
    }
  }, [profile, router]);

  // 4-Second Locked Cut Button Countdown for Admin Image Template Ad
  useEffect(() => {
    if (!adPopup.open || adPopup.lockSeconds <= 0) return;
    const tmr = setTimeout(() => {
      setAdPopup((prev) => ({ ...prev, lockSeconds: prev.lockSeconds - 1 }));
    }, 1000);
    return () => clearTimeout(tmr);
  }, [adPopup]);

  const showNotice = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  // Hold handlers for Post (Pin / Unpin / Delete)
  const startPostHold = (p) => {
    postHoldTimer.current = setTimeout(() => {
      setHoldTargetPost(p);
    }, 450);
  };
  const cancelPostHold = () => {
    if (postHoldTimer.current) clearTimeout(postHoldTimer.current);
  };

  // Hold handlers for @username (Send SP Tip)
  const startUserHold = (username, e) => {
    if (e) e.stopPropagation();
    userHoldTimer.current = setTimeout(() => {
      setTipTargetUser(username.replace(/^@/, ''));
    }, 420);
  };
  const cancelUserHold = () => {
    if (userHoldTimer.current) clearTimeout(userHoldTimer.current);
  };

  // Publish new post
  const handlePublishPost = (e) => {
    e.preventDefault();
    const cleaned = clean(newPostText, 400);
    if (!cleaned) return;
    const authorHandle =
      piUser?.username || profile.realName.replace(/\s+/g, '_') || 'Verified_Pioneer';
    const created = {
      id: `post-${Date.now()}`,
      author: authorHandle,
      content: cleaned,
      likes: 0,
      spEarned: 0,
      pinned: false,
      posterImage: '',
      time: 'Just now'
    };
    setPosts((prev) => [created, ...prev]);
    setNewPostText('');
  };

  // Like Handler: Every 100 Likes = +1 SP credited directly to author's Pi username wallet
  const handleLikePost = (postId, delta = 1) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLikes = p.likes + delta;
        const totalMilestones = Math.floor(nextLikes / 100);
        const newlyEarnedSp = totalMilestones - p.spEarned;

        if (newlyEarnedSp > 0) {
          if (profile?.completed && profile?.visibility === 'public') {
            setSpBalance((bal) => bal + newlyEarnedSp);
            showNotice(
              `🎉 ${nextLikes} Likes Reached! +${newlyEarnedSp} SP credited to @${p.author}`
            );
          } else {
            showNotice('⚠️ 100 Likes reached, but Private profiles earn 0 SP.');
          }
        }

        return {
          ...p,
          likes: nextLikes,
          spEarned: Math.max(p.spEarned, totalMilestones)
        };
      })
    );
  };

  // Upload Readymade Ad Image via FileReader
  const handleAdImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAdImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Launch Readymade Image Ad on Main View + Pin to Feed
  const handleLaunchImageAd = () => {
    if (!adImageDataUrl) return;
    setAdPopup({ open: true, lockSeconds: 4 });
    const sponsoredPost = {
      id: `ad-post-${Date.now()}`,
      author: 'RK33_Admin',
      content: adDisplayMode === 'image_text' ? clean(adTitle, 120) : '',
      likes: 100,
      spEarned: 1,
      pinned: true,
      posterImage: adImageDataUrl,
      time: 'Sponsored'
    };
    setPosts((prev) => [sponsoredPost, ...prev]);
  };

  // Pin / Unpin / Delete Post
  const handlePinToggle = (shouldPin) => {
    if (!holdTargetPost) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === holdTargetPost.id ? { ...p, pinned: shouldPin } : p))
    );
    setHoldTargetPost(null);
  };

  const handleDeletePost = () => {
    if (!holdTargetPost) return;
    setPosts((prev) => prev.filter((p) => p.id !== holdTargetPost.id));
    setHoldTargetPost(null);
  };

  // Send SP Tip
  const handleSendTip = (e) => {
    e.preventDefault();
    const amt = Number(tipAmount);
    if (!tipTargetUser || !amt || amt <= 0 || amt > spBalance) return;
    setSpBalance((prev) => prev - amt);
    showNotice(`⚡ Sent ${amt} SP Tip to @${tipTargetUser}!`);
    setTipAmount('');
    setTipTargetUser(null);
  };

  if (!profile?.completed) return null;

  const sortedPosts = [...posts].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <div className="p-3 rounded-xl bg-[#14141F] border border-zinc-700 text-xs text-white font-semibold shadow-lg">
          {toast}
        </div>
      )}

      {/* 4-SECOND LOCKED MAIN VIEW IMAGE AD POPUP */}
      {adPopup.open && (
        <div className="fixed inset-0 z-[9200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0D0D14] border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-[#08080E] border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-300">
                Sponsored Template Ad • @RK33
              </span>
              {adPopup.lockSeconds > 0 ? (
                <span className="px-2.5 py-1 bg-[#14141F] text-[11px] font-bold text-zinc-400 rounded-lg border border-zinc-700">
                  Wait {adPopup.lockSeconds}s
                </span>
              ) : (
                <button
                  onClick={() => setAdPopup({ open: false, lockSeconds: 0 })}
                  className="px-2.5 py-1 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white rounded-lg border border-zinc-600"
                >
                  ✕ Close
                </button>
              )}
            </div>

            {adImageDataUrl && (
              <img
                src={adImageDataUrl}
                alt="Sponsored Ad Poster"
                className="w-full max-h-72 object-cover"
              />
            )}

            {adDisplayMode === 'image_text' && adTitle && (
              <div className="p-3.5 text-xs font-bold text-white text-center">{adTitle}</div>
            )}
          </div>
        </div>
      )}

      {/* Top Feed Header + Admin Panel Toggle */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-white">{tx.feedHeader}</h1>
          <button
            type="button"
            onClick={() => setShowAdminBox((prev) => !prev)}
            className="px-2.5 py-1 bg-[#14141F] hover:bg-zinc-800 text-[11px] font-bold text-white border border-zinc-700 rounded-lg"
          >
            {tx.adminToggleBtn}
          </button>
        </div>

        <div className="p-2.5 bg-[#08080E] border border-zinc-800 rounded-xl text-[11px] text-zinc-300">
          {tx.likeRule}
        </div>

        <form onSubmit={handlePublishPost} className="flex gap-2">
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={tx.newPostPh}
            className="flex-1 bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl"
          >
            {tx.publishBtn}
          </button>
        </form>
      </div>

      {/* @RK33 ADMIN COMMAND CENTER: READYMADE IMAGE UPLOAD & TEMPLATE AD LAUNCHER */}
      {showAdminBox && (
        <div className="bg-[#0D0D14] border border-zinc-700 rounded-2xl p-4 space-y-3.5 shadow-2xl">
          <h2 className="text-xs font-bold text-white border-b border-zinc-800 pb-2">
            {tx.adminTitle}
          </h2>

          {/* Readymade Image File Upload */}
          <div className="space-y-2">
            <div className="text-[11px] text-zinc-300 font-semibold">{tx.uploadAdLabel}</div>
            <div className="flex flex-wrap gap-2">
              <label className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl cursor-pointer">
                {tx.chooseAdImg}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdImageUpload}
                  className="hidden"
                />
              </label>
              {adImageDataUrl && (
                <button
                  type="button"
                  onClick={() => setAdImageDataUrl('')}
                  className="px-3 py-1.5 bg-[#08080E] text-xs text-red-300 border border-zinc-800 rounded-xl"
                >
                  {tx.removeImgBtn}
                </button>
              )}
            </div>
          </div>

          {/* One-Click Readymade Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESET_BANNERS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setAdImageDataUrl(p.dataUrl)}
                className="px-2.5 py-1 bg-[#08080E] hover:bg-[#14141F] text-[11px] text-zinc-300 border border-zinc-800 rounded-lg"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Display Mode Toggle: Full Poster vs Image + Text */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAdDisplayMode('full_poster')}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold border ${
                adDisplayMode === 'full_poster'
                  ? 'bg-[#181826] text-white border-zinc-500'
                  : 'bg-[#08080E] text-zinc-400 border-zinc-800'
              }`}
            >
              {tx.modeFullPoster}
            </button>
            <button
              type="button"
              onClick={() => setAdDisplayMode('image_text')}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold border ${
                adDisplayMode === 'image_text'
                  ? 'bg-[#181826] text-white border-zinc-500'
                  : 'bg-[#08080E] text-zinc-400 border-zinc-800'
              }`}
            >
              {tx.modeImgText}
            </button>
          </div>

          {adDisplayMode === 'image_text' && (
            <input
              type="text"
              value={adTitle}
              onChange={(e) => setAdTitle(e.target.value)}
              className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          )}

          {/* Live Image Preview inside Admin Panel */}
          {adImageDataUrl && (
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#08080E]">
              <img src={adImageDataUrl} alt="Ad Preview" className="w-full max-h-44 object-cover" />
            </div>
          )}

          {/* Max SP Supply Control */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-zinc-300">{tx.maxSpSupplyLabel}</span>
            <input
              type="number"
              value={maxSpSupply}
              onChange={(e) => setMaxSpSupply(Number(e.target.value))}
              className="w-36 bg-[#08080E] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white text-right"
            />
          </div>

          <button
            type="button"
            onClick={handleLaunchImageAd}
            className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-600 rounded-xl shadow-lg"
          >
            {tx.launchAdBtn}
          </button>
        </div>
      )}

      {/* POSTS STREAM */}
      <div className="space-y-3">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            onMouseDown={() => startPostHold(post)}
            onMouseUp={cancelPostHold}
            onMouseLeave={cancelPostHold}
            onTouchStart={() => startPostHold(post)}
            onTouchEnd={cancelPostHold}
            className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span
                onMouseDown={(e) => startUserHold(post.author, e)}
                onMouseUp={cancelUserHold}
                onTouchStart={(e) => startUserHold(post.author, e)}
                onTouchEnd={cancelUserHold}
                onClick={() => setTipTargetUser(post.author)}
                className="text-xs font-bold text-emerald-400 cursor-pointer hover:underline"
              >
                @{post.author}
              </span>
              <div className="flex items-center gap-2">
                {post.pinned && (
                  <span className="px-2 py-0.5 bg-[#14141F] border border-zinc-700 rounded text-[10px] text-zinc-300">
                    📌 Pinned
                  </span>
                )}
                <span className="text-[10px] text-zinc-500">{post.time}</span>
              </div>
            </div>

            {post.posterImage && (
              <div className="rounded-xl overflow-hidden border border-zinc-800">
                <img src={post.posterImage} alt="Post Banner" className="w-full max-h-64 object-cover" />
              </div>
            )}

            {post.content && (
              <p className="text-xs text-zinc-200 leading-relaxed">{post.content}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLikePost(post.id, 1)}
                  className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl"
                >
                  {tx.likeBtn} ({post.likes})
                </button>
                <button
                  type="button"
                  onClick={() => handleLikePost(post.id, 100)}
                  className="px-2.5 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-[11px] font-semibold text-emerald-400 border border-zinc-700 rounded-xl"
                >
                  {tx.sim100LikesBtn}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setTipTargetUser(post.author)}
                className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl"
              >
                {tx.tipBtn}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3-Button Hold Menu: Pin | Unpin | Delete */}
      {holdTargetPost && (
        <div className="fixed inset-0 z-[8800] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-white border-b border-zinc-800 pb-2">
              Post Action (@{holdTargetPost.author})
            </div>
            <button
              onClick={() => handlePinToggle(true)}
              className="w-full py-2.5 bg-[#14141F] text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              📌 Pin Post
            </button>
            <button
              onClick={() => handlePinToggle(false)}
              className="w-full py-2.5 bg-[#14141F] text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              📍 Unpin Post
            </button>
            <button
              onClick={handleDeletePost}
              className="w-full py-2.5 bg-[#14141F] text-xs font-semibold text-red-300 border border-zinc-700 rounded-xl"
            >
              🗑️ Delete Post
            </button>
            <button
              onClick={() => setHoldTargetPost(null)}
              className="w-full py-2 bg-[#08080E] text-xs text-zinc-400 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hold @username SP Tip Modal */}
      {tipTargetUser && (
        <div className="fixed inset-0 z-[8900] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white">Send SP Tip to @{tipTargetUser}</span>
              <button
                onClick={() => setTipTargetUser(null)}
                className="px-2 py-0.5 bg-[#14141F] text-xs text-zinc-300 rounded border border-zinc-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendTip} className="space-y-2.5">
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="Enter SP amount"
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#14141F] text-xs font-bold text-white border border-zinc-700 rounded-xl"
              >
                ⚡ Send SP Tip Now
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-zinc-500 pt-2">{tx.copyright}</div>
    </div>
  );
}
