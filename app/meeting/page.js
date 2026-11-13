'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePiSphere } from '@/app/layout';
import { clean } from '@/lib/sanitize';

const MEET_TEXT = {
  hi: {
    headerTitle: '100-यूज़र क्लाउड मीटिंग रूम (Zoom SFU)',
    ratioBanner: 'SP नियम: 5 यूज़र = 1 SP | 10 यूज़र = 2 SP | 15 यूज़र = 3 SP (हर 5 पायनियर्स के क्रम में +1 SP)',
    createMeetBtn: '+ मीटिंग ग्रुप बनाएं',
    joinLiveBtn: '🎥 लाइव मीटिंग जुड़ें',
    genLinkBtn: '🔗 इनवाइट लिंक जनरेट करें',
    holdHint: '💡 टिप: किसी भी मीटिंग ग्रुप को पिन/अनपिन/डिलीट करने के लिए दबाकर रखें (Hold)। @username को दबाकर रखने पर SP टिप भेजें।',
    activeSpeaker: '🎙️ सक्रिय वक्ता (Active Speaker)',
    claimMeetSpBtn: 'मीटिंग SP क्लेम करें',
    leaveRoomBtn: '← मीटिंग रूम से बाहर निकलें',
    aiSummaryTitle: '🤖 AI मीटिंग समरी और नोट्स (Summary Chat Route)',
    aiSummaryLocked: 'यह AI मीटिंग समरी लॉक्ड है। इसे 0.5 π या 5 Sphere Points (SP) से अनलॉक करें।',
    unlockWithPiBtn: '🔓 0.5 π से अनलॉक करें',
    unlockWithSpBtn: '🔓 5 SP से अनलॉक करें',
    holdMenuTitle: 'मीटिंग ग्रुप एक्शन चुनें',
    pinBtn: '📌 पिन करें (Pin)',
    unpinBtn: '📍 अनपिन करें (Unpin)',
    deleteBtn: '🗑️ डिलीट करें (Delete)',
    cancelBtn: 'रद्द करें',
    tipModalTitle: 'मीटिंग होस्ट/पायनियर को SP टिप भेजें',
    tipAmountPh: 'SP मात्रा लिखें (जैसे 5)',
    sendTipBtn: '⚡ तुरंत SP टिप भेजें',
    createModalTitle: 'नया क्लाउड मीटिंग ग्रुप बनाएं (Max 100)',
    topicPh: 'मीटिंग का विषय लिखें',
    participantsPh: 'लाइव प्रतिभागी संख्या (जैसे 15)',
    createConfirmBtn: '✓ मीटिंग ग्रुप बनाएं',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  },
  en: {
    headerTitle: '100-User Cloud Meeting Hub (Zoom SFU)',
    ratioBanner: 'SP Rule: 5 Users = 1 SP | 10 Users = 2 SP | 15 Users = 3 SP (+1 SP for every 5 Pioneers)',
    createMeetBtn: '+ Create Meeting Group',
    joinLiveBtn: '🎥 Join Live Meeting',
    genLinkBtn: '🔗 Generate Invite Link',
    holdHint: '💡 Tip: Press & Hold any meeting group for Pin / Unpin / Delete. Hold @username to Send SP Tip.',
    activeSpeaker: '🎙️ Active Speaker',
    claimMeetSpBtn: 'Claim Meeting SP',
    leaveRoomBtn: '← Leave Meeting Room',
    aiSummaryTitle: '🤖 AI Meeting Summary & Notes (Summary Chat Route)',
    aiSummaryLocked: 'This AI Meeting Summary is locked. Unlock with 0.5 π or 5 Sphere Points (SP).',
    unlockWithPiBtn: '🔓 Unlock with 0.5 π',
    unlockWithSpBtn: '🔓 Unlock with 5 SP',
    holdMenuTitle: 'Select Meeting Group Action',
    pinBtn: '📌 Pin Group',
    unpinBtn: '📍 Unpin Group',
    deleteBtn: '🗑️ Delete Group',
    cancelBtn: 'Cancel',
    tipModalTitle: 'Send SP Tip to Meeting Pioneer',
    tipAmountPh: 'Enter SP amount (e.g. 5)',
    sendTipBtn: '⚡ Send SP Tip Now',
    createModalTitle: 'Create Cloud Meeting Group (Max 100)',
    topicPh: 'Enter Meeting Topic',
    participantsPh: 'Active participants count (e.g. 15)',
    createConfirmBtn: '✓ Create Meeting Group',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  }
};

// Exact 5-Ratio Cloud Meeting SP Formula: 5->1, 10->2, 15->3 ...
export function calculateMeetingSp(participants) {
  const capped = Math.min(Math.max(Number(participants) || 0, 0), 100);
  return Math.floor(capped / 5);
}

export default function MeetingPage() {
  const router = useRouter();
  const { lang, piUser, spBalance, setSpBalance, profile } = usePiSphere();
  const tx = MEET_TEXT[lang] || MEET_TEXT.hi;

  const [meetings, setMeetings] = useState([
    {
      id: 'meet-101',
      title: 'Pi Mainnet Web3 Builders Live Townhall',
      host: 'Sharma_Coaching',
      participants: 25, // 25 users => 5 SP
      pinned: true,
      inviteLink: 'https://zesty-cranachan-8d81d1.netlify.app/meeting?room=meet-101',
      summaryUnlocked: false,
      summaryText: 'Key Takeaways: 1) Pi App Studio Step-2 verification is mandatory. 2) Public profiles earn Sphere Points (SP). 3) Local merchants can accept Pi directly.'
    },
    {
      id: 'meet-102',
      title: 'Tele-Medicine & Health Consultation Batch',
      host: 'Dr_Verma_Pi',
      participants: 15, // 15 users => 3 SP
      pinned: false,
      inviteLink: 'https://zesty-cranachan-8d81d1.netlify.app/meeting?room=meet-102',
      summaryUnlocked: false,
      summaryText: 'Key Takeaways: Daily preventive healthcare Q&A and Pi consultation booking slots for verified Pioneers.'
    }
  ]);

  const [activeMeetId, setActiveMeetId] = useState(null);
  const [holdTargetMeet, setHoldTargetMeet] = useState(null);
  const [tipTargetUser, setTipTargetUser] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newParticipants, setNewParticipants] = useState(15);
  const [toast, setToast] = useState('');

  const meetHoldTimer = useRef(null);
  const userHoldTimer = useRef(null);

  // Strict Profile Gate: Redirect to /settings if profile is incomplete
  useEffect(() => {
    if (!profile?.completed) {
      router.replace('/settings');
    }
  }, [profile, router]);

  const showNotice = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  // Hold handlers for Meeting Group Card (Pin / Unpin / Delete)
  const startMeetHold = (m) => {
    meetHoldTimer.current = setTimeout(() => {
      setHoldTargetMeet(m);
    }, 450);
  };
  const cancelMeetHold = () => {
    if (meetHoldTimer.current) clearTimeout(meetHoldTimer.current);
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

  const handlePinToggle = (shouldPin) => {
    if (!holdTargetMeet) return;
    setMeetings((prev) =>
      prev.map((m) => (m.id === holdTargetMeet.id ? { ...m, pinned: shouldPin } : m))
    );
    setHoldTargetMeet(null);
  };

  const handleDeleteMeet = () => {
    if (!holdTargetMeet) return;
    setMeetings((prev) => prev.filter((m) => m.id !== holdTargetMeet.id));
    if (activeMeetId === holdTargetMeet.id) setActiveMeetId(null);
    setHoldTargetMeet(null);
  };

  // Claim 5-ratio SP reward (5=1 SP, 10=2 SP, 15=3 SP...)
  const handleClaimMeetSp = (m, e) => {
    if (e) e.stopPropagation();
    if (!profile?.completed || profile?.visibility !== 'public') {
      showNotice('⚠️ Only Public verified profiles receive Sphere Points (SP).');
      return;
    }
    const sp = calculateMeetingSp(m.participants);
    if (sp <= 0) {
      showNotice('⚠️ At least 5 participants are required to earn 1 SP.');
      return;
    }
    setSpBalance((prev) => prev + sp);
    showNotice(`✅ +${sp} SP (${m.participants} users @ 5:1 ratio) credited to your wallet!`);
  };

  // Unlock AI Summary via 5 SP or 0.5 Pi
  const handleUnlockSummary = (meetId, method) => {
    if (method === 'sp') {
      if (spBalance < 5) {
        showNotice('⚠️ Insufficient SP balance (5 SP required).');
        return;
      }
      setSpBalance((prev) => prev - 5);
    }
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetId ? { ...m, summaryUnlocked: true } : m))
    );
    showNotice(
      method === 'sp'
        ? '🔓 AI Meeting Summary unlocked using 5 SP!'
        : '🔓 AI Meeting Summary unlocked via 0.5 π payment!'
    );
  };

  // Send SP Tip on @username Hold
  const handleSendTip = async (e) => {
    e.preventDefault();
    const amt = Number(tipAmount);
    if (!tipTargetUser || !amt || amt <= 0 || amt > spBalance) return;
    setSpBalance((prev) => prev - amt);
    showNotice(`⚡ Sent ${amt} SP Tip to @${tipTargetUser}!`);
    setTipAmount('');
    setTipTargetUser(null);
  };

  // Create new Meeting Group
  const handleCreateMeeting = (e) => {
    e.preventDefault();
    const cleanTopic = clean(newTopic, 70);
    if (!cleanTopic) return;
    const count = Math.min(Math.max(Number(newParticipants) || 5, 1), 100);
    const id = `meet-${Date.now()}`;
    const created = {
      id,
      title: cleanTopic,
      host: piUser?.username || profile.realName.replace(/\s+/g, '_') || 'Pioneer_Host',
      participants: count,
      pinned: false,
      inviteLink: `https://zesty-cranachan-8d81d1.netlify.app/meeting?room=${id}`,
      summaryUnlocked: false,
      summaryText: `AI Summary for "${cleanTopic}": Automated action items and speaker transcript synced.`
    };
    setMeetings((prev) => [created, ...prev]);
    setNewTopic('');
    setShowCreateModal(false);
  };

  if (!profile?.completed) return null;

  const activeMeet = meetings.find((m) => m.id === activeMeetId);
  const sortedMeetings = [...meetings].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <div className="p-3 rounded-xl bg-[#14141F] border border-zinc-700 text-xs text-white font-semibold shadow-lg">
          {toast}
        </div>
      )}

      {/* Top Cloud Meeting Control Card */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold text-white">{tx.headerTitle}</h1>
          <span className="px-2 py-0.5 bg-[#14141F] border border-zinc-700 rounded text-[10px] text-zinc-300">
            SFU 100-Seat
          </span>
        </div>

        <div className="p-2.5 bg-[#08080E] border border-zinc-800 rounded-xl text-[11px] text-zinc-300">
          {tx.ratioBanner}
        </div>

        {/* Both Required Buttons: Create Meeting Group & Join Live Meeting */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="py-2.5 px-3 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
          >
            {tx.createMeetBtn}
          </button>
          <button
            type="button"
            onClick={() => {
              if (sortedMeetings[0]) setActiveMeetId(sortedMeetings[0].id);
            }}
            className="py-2.5 px-3 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
          >
            {tx.joinLiveBtn}
          </button>
        </div>

        <div className="text-[11px] text-zinc-400">{tx.holdHint}</div>
      </div>

      {/* Live Meeting Room View OR Meeting Groups List */}
      {activeMeet ? (
        <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-xs font-bold text-white">{activeMeet.title}</h2>
              <span
                onMouseDown={(e) => startUserHold(activeMeet.host, e)}
                onMouseUp={cancelUserHold}
                onTouchStart={(e) => startUserHold(activeMeet.host, e)}
                onTouchEnd={cancelUserHold}
                onClick={() => setTipTargetUser(activeMeet.host)}
                className="text-[11px] text-emerald-400 cursor-pointer hover:underline"
              >
                Host: @{activeMeet.host} (💸 Hold/Tap to Tip SP)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveMeetId(null)}
              className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs text-white border border-zinc-700 rounded-xl"
            >
              {tx.leaveRoomBtn}
            </button>
          </div>

          {/* Active Speaker Stage */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-4 bg-[#08080E] border border-zinc-700 rounded-2xl text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#14141F] border border-zinc-600 flex items-center justify-center text-sm font-bold text-white">
                {activeMeet.host.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-xs font-bold text-white">@{activeMeet.host}</div>
              <div className="text-[10px] text-emerald-400">{tx.activeSpeaker}</div>
            </div>
            <div className="p-4 bg-[#08080E] border border-zinc-800 rounded-2xl text-center flex flex-col justify-center">
              <div className="text-lg font-extrabold text-white">{activeMeet.participants} / 100</div>
              <div className="text-[11px] text-zinc-400">Live Pioneers Connected</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                +{calculateMeetingSp(activeMeet.participants)} SP Ratio Active
              </div>
            </div>
          </div>

          {/* Generate Link & Claim SP Row */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(activeMeet.inviteLink);
                showNotice(`🔗 Link Copied: ${activeMeet.inviteLink}`);
              }}
              className="flex-1 py-2 px-3 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              {tx.genLinkBtn}
            </button>
            <button
              type="button"
              onClick={(e) => handleClaimMeetSp(activeMeet, e)}
              className="py-2 px-3 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-emerald-400 border border-zinc-700 rounded-xl"
            >
              {tx.claimMeetSpBtn} (+{calculateMeetingSp(activeMeet.participants)} SP)
            </button>
          </div>

          {/* AI Meeting Summary Route Card at Bottom */}
          <div className="p-3.5 bg-[#08080E] border border-zinc-800 rounded-2xl space-y-2.5">
            <div className="text-xs font-bold text-white">{tx.aiSummaryTitle}</div>
            {activeMeet.summaryUnlocked ? (
              <p className="text-xs text-zinc-200 leading-relaxed">{activeMeet.summaryText}</p>
            ) : (
              <>
                <p className="text-[11px] text-zinc-400">{tx.aiSummaryLocked}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUnlockSummary(activeMeet.id, 'pi')}
                    className="py-2 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl"
                  >
                    {tx.unlockWithPiBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnlockSummary(activeMeet.id, 'sp')}
                    className="py-2 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-emerald-400 border border-zinc-700 rounded-xl"
                  >
                    {tx.unlockWithSpBtn}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedMeetings.map((m) => {
            const sp = calculateMeetingSp(m.participants);
            return (
              <div
                key={m.id}
                onMouseDown={() => startMeetHold(m)}
                onMouseUp={cancelMeetHold}
                onMouseLeave={cancelMeetHold}
                onTouchStart={() => startMeetHold(m)}
                onTouchEnd={cancelMeetHold}
                onClick={() => setActiveMeetId(m.id)}
                className="bg-[#0D0D14] hover:bg-[#12121C] border border-zinc-800 rounded-2xl p-4 cursor-pointer transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{m.title}</span>
                  {m.pinned && (
                    <span className="px-2 py-0.5 bg-[#14141F] border border-zinc-700 rounded text-[10px] text-zinc-300">
                      📌 Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span
                    onMouseDown={(e) => startUserHold(m.host, e)}
                    onMouseUp={cancelUserHold}
                    onTouchStart={(e) => startUserHold(m.host, e)}
                    onTouchEnd={cancelUserHold}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTipTargetUser(m.host);
                    }}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    @{m.host} (💸 Hold to Tip SP)
                  </span>
                  <span className="text-zinc-400">
                    👥 {m.participants}/100 Users • <strong className="text-emerald-400">+{sp} SP</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3-Button Hold Modal: Pin | Unpin | Delete */}
      {holdTargetMeet && (
        <div className="fixed inset-0 z-[8800] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-white border-b border-zinc-800 pb-2">
              {tx.holdMenuTitle}: {holdTargetMeet.title}
            </div>
            <button
              onClick={() => handlePinToggle(true)}
              className="w-full py-2.5 bg-[#14141F] text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              {tx.pinBtn}
            </button>
            <button
              onClick={() => handlePinToggle(false)}
              className="w-full py-2.5 bg-[#14141F] text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              {tx.unpinBtn}
            </button>
            <button
              onClick={handleDeleteMeet}
              className="w-full py-2.5 bg-[#14141F] text-xs font-semibold text-red-300 border border-zinc-700 rounded-xl"
            >
              {tx.deleteBtn}
            </button>
            <button
              onClick={() => setHoldTargetMeet(null)}
              className="w-full py-2 bg-[#08080E] text-xs text-zinc-400 rounded-xl"
            >
              {tx.cancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* @username Hold SP Tip Modal */}
      {tipTargetUser && (
        <div className="fixed inset-0 z-[8900] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white">{tx.tipModalTitle}</span>
              <button
                onClick={() => setTipTargetUser(null)}
                className="px-2 py-0.5 bg-[#14141F] text-xs text-zinc-300 rounded border border-zinc-700"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">@{tipTargetUser}</div>
            <form onSubmit={handleSendTip} className="space-y-2.5">
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder={tx.tipAmountPh}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#14141F] text-xs font-bold text-white border border-zinc-700 rounded-xl"
              >
                {tx.sendTipBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Cloud Meeting Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[8850] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white">{tx.createModalTitle}</span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-2 py-0.5 bg-[#14141F] text-xs text-zinc-300 rounded border border-zinc-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="space-y-2.5">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder={tx.topicPh}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <input
                type="number"
                value={newParticipants}
                onChange={(e) => setNewParticipants(e.target.value)}
                placeholder={tx.participantsPh}
                max={100}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#14141F] text-xs font-bold text-white border border-zinc-700 rounded-xl"
              >
                {tx.createConfirmBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="text-center text-[11px] text-zinc-500 pt-2">{tx.copyright}</div>
    </div>
  );
}
