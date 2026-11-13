'use client';
import { useState, useRef } from 'react';
import { usePiSphere } from '@/app/layout';
import { clean } from '@/lib/sanitize';

const CHAT_TEXT = {
  hi: {
    headerTitle: 'स्मार्ट चैट्स, ग्रुप्स और चैनल्स',
    personalTab: '👤 पर्सनल चैट',
    groupTab: '👥 ग्रुप्स (≤250)',
    channelTab: '📢 चैनल्स (∞)',
    createGroupBtn: '+ नया ग्रुप (Max 250)',
    createChannelBtn: '+ नया चैनल (Unlimited)',
    personalRule: 'नियम: 1000 पर्सनल चैट पूरे होने पर +1 SP (केवल पब्लिक प्रोफाइल)',
    groupRule: 'नियम: 24h में ≥5 पोस्ट अनिवार्य | 30=1 SP, 60=5 SP, 90=12 SP, 120=30 SP, 150=70 SP, 200+=120 SP (अधिकतम 250 सदस्य)',
    channelRule: 'नियम: अनलिमिटेड चैनल | 24h में ≥5 पोस्ट अनिवार्य | प्रति 100 सब्सक्राइबर = +10 SP',
    holdHint: '💡 टिप: पिन/अनपिन/डिलीट के लिए किसी भी चैट पर उंगली दबाकर रखें (Hold)। टिप भेजने के लिए @username को दबाकर रखें।',
    backToList: '← वापस सूची पर',
    msgPlaceholder: 'सुरक्षित संदेश लिखें...',
    sendBtn: 'भेजें ➤',
    claimSpBtn: 'SP रिवॉर्ड क्लेम करें',
    pinnedBadge: '📌 पिन किया गया',
    holdMenuTitle: 'चैट / ग्रुप एक्शन चुनें',
    pinBtn: '📌 पिन करें (Pin)',
    unpinBtn: '📍 अनपिन करें (Unpin)',
    deleteBtn: '🗑️ डिलीट करें (Delete)',
    cancelBtn: 'रद्द करें',
    tipModalTitle: 'पायनियर को Sphere Points (SP) टिप भेजें',
    tipAmountPh: 'SP मात्रा लिखें (जैसे 5)',
    sendTipNowBtn: '⚡ तुरंत SP टिप भेजें',
    createModalGroup: 'नया चैट ग्रुप बनाएं (अधिकतम 250 सदस्य)',
    createModalChannel: 'नया अनलिमिटेड चैनल बनाएं',
    namePh: 'ग्रुप / चैनल का नाम लिखें',
    membersPh: 'सदस्य / सब्सक्राइबर संख्या (टेस्टिंग के लिए)',
    createConfirmBtn: '✓ अभी बनाएं',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  },
  en: {
    headerTitle: 'Smart Chats, Groups & Channels',
    personalTab: '👤 Personal Chat',
    groupTab: '👥 Groups (≤250)',
    channelTab: '📢 Channels (∞)',
    createGroupBtn: '+ New Group (Max 250)',
    createChannelBtn: '+ New Channel (Unlimited)',
    personalRule: 'Rule: 1000 Personal Messages = +1 SP (Public Profile Only)',
    groupRule: 'Rule: ≥5 posts/24h required | 30=1 SP, 60=5 SP, 90=12 SP, 120=30 SP, 150=70 SP, 200+=120 SP (Max 250 limit)',
    channelRule: 'Rule: Unlimited Channel | ≥5 posts/24h required | Every 100 Subscribers = +10 SP',
    holdHint: '💡 Tip: Press & Hold any item for Pin / Unpin / Delete. Press & Hold any @username to Send SP Tip.',
    backToList: '← Back to List',
    msgPlaceholder: 'Write a secure message...',
    sendBtn: 'Send ➤',
    claimSpBtn: 'Claim SP Reward',
    pinnedBadge: '📌 Pinned',
    holdMenuTitle: 'Select Chat / Group Action',
    pinBtn: '📌 Pin Item',
    unpinBtn: '📍 Unpin Item',
    deleteBtn: '🗑️ Delete Item',
    cancelBtn: 'Cancel',
    tipModalTitle: 'Send Sphere Points (SP) Tip to Pioneer',
    tipAmountPh: 'Enter SP amount (e.g. 5)',
    sendTipNowBtn: '⚡ Send SP Tip Now',
    createModalGroup: 'Create New Group (Max 250 Members)',
    createModalChannel: 'Create New Unlimited Channel',
    namePh: 'Enter Group / Channel Name',
    membersPh: 'Members / Subscribers count',
    createConfirmBtn: '✓ Create Now',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  }
};

// Exact Group SP Tier Calculator (Max 250 limit, >=5 posts in 24h)
export function calculateGroupSpReward(members, posts24h) {
  if (posts24h < 5 || members < 30) return 0;
  const cappedMembers = Math.min(members, 250);
  if (cappedMembers >= 200) return 120;
  if (cappedMembers >= 150) return 70;
  if (cappedMembers >= 120) return 30;
  if (cappedMembers >= 90) return 12;
  if (cappedMembers >= 60) return 5;
  if (cappedMembers >= 30) return 1;
  return 0;
}

// Exact Channel SP Calculator (Unlimited subscribers, >=5 posts in 24h, 100 subs = 10 SP)
export function calculateChannelSpReward(subscribers, posts24h) {
  if (posts24h < 5 || subscribers < 100) return 0;
  return Math.floor(subscribers / 100) * 10;
}

export default function ChatPage() {
  const { lang, piUser, spBalance, setSpBalance, profile } = usePiSphere();
  const tx = CHAT_TEXT[lang] || CHAT_TEXT.hi;

  const [subTab, setSubTab] = useState('personal'); // 'personal' | 'group' | 'channel'
  const [activeRoomId, setActiveRoomId] = useState(null); // null = List View, id = Full-Screen Chat View
  const [personalMsgCount, setPersonalMsgCount] = useState(998); // 2 away from 1000 = +1 SP demo
  const [inputText, setInputText] = useState('');
  const [toast, setToast] = useState('');

  // Rooms List State
  const [rooms, setRooms] = useState([
    {
      id: 'p-1',
      category: 'personal',
      title: 'Sharma Coaching Official',
      handle: 'Sharma_Coaching',
      members: 2,
      posts24h: 12,
      pinned: true,
      lastTime: '10:42 AM',
      messages: [
        { id: 'm1', sender: 'Sharma_Coaching', text: 'Namaste Pioneer! Live batch starts at 6 PM today.', time: '10:40 AM', status: 'Delivered' },
        { id: 'm2', sender: 'Pioneer_Member', text: 'Thank you sir, joining via Cloud Meet link.', time: '10:42 AM', status: 'Delivered' }
      ]
    },
    {
      id: 'p-2',
      category: 'personal',
      title: 'Dr. Verma Tele-Clinic',
      handle: 'Dr_Verma_Pi',
      members: 2,
      posts24h: 8,
      pinned: false,
      lastTime: 'Yesterday',
      messages: [
        { id: 'm3', sender: 'Dr_Verma_Pi', text: 'Your health consultation report is ready.', time: 'Yesterday', status: 'Delivered' }
      ]
    },
    {
      id: 'g-1',
      category: 'group',
      title: 'India Pioneers Builders Hub',
      handle: 'India_Pi_Builders',
      members: 210, // 200+ tier => 120 SP
      posts24h: 7,
      pinned: true,
      lastTime: '11:15 AM',
      messages: [
        { id: 'm4', sender: 'India_Pi_Builders', text: 'Welcome to our 210-member builder group! 24h posts > 5 completed.', time: '11:15 AM', status: 'Delivered' }
      ]
    },
    {
      id: 'g-2',
      category: 'group',
      title: 'Bihar Local Merchants Group',
      handle: 'Bihar_Pi_Merchants',
      members: 95, // 90+ tier => 12 SP
      posts24h: 6,
      pinned: false,
      lastTime: '09:20 AM',
      messages: [
        { id: 'm5', sender: 'Bihar_Pi_Merchants', text: 'Local merchants accepting Pi payments in Dehri & Patna.', time: '09:20 AM', status: 'Delivered' }
      ]
    },
    {
      id: 'c-1',
      category: 'channel',
      title: 'PiSphere Global Announcements',
      handle: 'PiSphere_News',
      members: 450, // 400 subs => 40 SP
      posts24h: 9,
      pinned: true,
      lastTime: 'Today',
      messages: [
        { id: 'm6', sender: 'PiSphere_News', text: 'Official Channel: Web3 Super-App v2.0 security patches active.', time: 'Today', status: 'Delivered' }
      ]
    }
  ]);

  // Long-Press (Hold) State for Pin / Unpin / Delete (3 Buttons)
  const [holdTargetRoom, setHoldTargetRoom] = useState(null);
  // Long-Press (Hold) State for @username SP Tipping
  const [tipTargetUser, setTipTargetUser] = useState(null);
  const [tipAmount, setTipAmount] = useState('');
  // Create Group / Channel Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomMembers, setNewRoomMembers] = useState(60);

  const roomHoldTimer = useRef(null);
  const userHoldTimer = useRef(null);

  const showNotice = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  // Finger Hold handlers for Chat/Group/Channel item (Pin / Unpin / Delete)
  const startRoomHold = (room) => {
    roomHoldTimer.current = setTimeout(() => {
      setHoldTargetRoom(room);
    }, 450);
  };
  const cancelRoomHold = () => {
    if (roomHoldTimer.current) clearTimeout(roomHoldTimer.current);
  };

  // Finger Hold handlers for @username (Send SP Tip Popup)
  const startUserHold = (username, e) => {
    if (e) e.stopPropagation();
    userHoldTimer.current = setTimeout(() => {
      setTipTargetUser(username.replace(/^@/, ''));
    }, 420);
  };
  const cancelUserHold = () => {
    if (userHoldTimer.current) clearTimeout(userHoldTimer.current);
  };

  // Pin / Unpin / Delete execution
  const handlePinToggle = (shouldPin) => {
    if (!holdTargetRoom) return;
    setRooms((prev) =>
      prev.map((r) => (r.id === holdTargetRoom.id ? { ...r, pinned: shouldPin } : r))
    );
    setHoldTargetRoom(null);
  };

  const handleDeleteRoom = () => {
    if (!holdTargetRoom) return;
    setRooms((prev) => prev.filter((r) => r.id !== holdTargetRoom.id));
    if (activeRoomId === holdTargetRoom.id) setActiveRoomId(null);
    setHoldTargetRoom(null);
  };

  // Send message inside active chat room
  const handleSendMessage = (e) => {
    e.preventDefault();
    const cleaned = clean(inputText, 400);
    if (!cleaned || !activeRoomId) return;

    const senderHandle = piUser?.username || (profile?.realName ? profile.realName.replace(/\s+/g, '_') : 'Pioneer_User');

    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoomId) return r;
        const nextPosts24h = r.posts24h + 1;
        return {
          ...r,
          posts24h: nextPosts24h,
          lastTime: 'Just now',
          messages: [
            ...r.messages,
            {
              id: `msg-${Date.now()}`,
              sender: senderHandle,
              text: cleaned,
              time: 'Just now',
              status: 'Delivered'
            }
          ]
        };
      })
    );

    setInputText('');

    // Personal Chat 1000 messages = +1 SP check (Public profile only)
    const currentRoom = rooms.find((r) => r.id === activeRoomId);
    if (currentRoom?.category === 'personal') {
      const nextCount = personalMsgCount + 1;
      setPersonalMsgCount(nextCount);
      if (nextCount % 1000 === 0) {
        if (profile?.completed && profile?.visibility === 'public') {
          setSpBalance((prev) => prev + 1);
          showNotice('🎉 1000 Personal Chats Completed! +1 SP credited to your wallet.');
        } else {
          showNotice('⚠️ 1000 Chats reached, but Private/Incomplete profiles earn 0 SP.');
        }
      }
    }
  };

  // Claim Group or Channel SP Reward based on exact formula
  const handleClaimRoomSp = (room, e) => {
    e.stopPropagation();
    if (!profile?.completed || profile?.visibility !== 'public') {
      showNotice('⚠️ Only Public verified profiles can earn Sphere Points (SP).');
      return;
    }
    const reward =
      room.category === 'group'
        ? calculateGroupSpReward(room.members, room.posts24h)
        : calculateChannelSpReward(room.members, room.posts24h);

    if (reward <= 0) {
      showNotice('⚠️ Criteria not met: Minimum 5 posts in 24h and tier member count required.');
      return;
    }

    setSpBalance((prev) => prev + reward);
    showNotice(`✅ +${reward} SP credited to your Pi username wallet!`);
  };

  // Send SP Tip on @username Hold
  const handleSendTip = async (e) => {
    e.preventDefault();
    const amt = Number(tipAmount);
    if (!tipTargetUser || !amt || amt <= 0 || amt > spBalance) return;

    setSpBalance((prev) => prev - amt);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tip_sp',
          toUsername: tipTargetUser,
          spAmount: amt,
        }),
      });
    } catch (err) {}

    showNotice(`⚡ Sent ${amt} SP Tip to @${tipTargetUser}! Recorded in Wallet Ledger.`);
    setTipAmount('');
    setTipTargetUser(null);
  };

  // Create New Group (Max 250 enforced) or Channel (Unlimited)
  const handleCreateRoom = (e) => {
    e.preventDefault();
    const cleanTitle = clean(newRoomName, 60);
    if (!cleanTitle) return;

    const isGroup = subTab === 'group';
    const rawCount = Number(newRoomMembers) || 30;
    const finalCount = isGroup ? Math.min(Math.max(rawCount, 1), 250) : Math.max(rawCount, 1);

    const newRoom = {
      id: `${subTab}-${Date.now()}`,
      category: subTab,
      title: cleanTitle,
      handle: cleanTitle.replace(/\s+/g, '_'),
      members: finalCount,
      posts24h: 5,
      pinned: false,
      lastTime: 'Just now',
      messages: [
        {
          id: `init-${Date.now()}`,
          sender: piUser?.username || 'Pioneer_Host',
          text: `Welcome to ${cleanTitle}!`,
          time: 'Just now',
          status: 'Delivered'
        }
      ]
    };

    setRooms((prev) => [newRoom, ...prev]);
    setNewRoomName('');
    setShowCreateModal(false);
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  const filteredRooms = rooms
    .filter((r) => r.category === subTab)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="space-y-3.5 pb-8">
      {toast && (
        <div className="p-3 rounded-xl bg-[#14141F] border border-zinc-700 text-xs text-white font-semibold shadow-lg">
          {toast}
        </div>
      )}

      {/* VIEW 1: CLEAN LIST VIEW (When no chat room is open — Prevents Double Scrolling Bug) */}
      {!activeRoom ? (
        <>
          <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-bold text-white">{tx.headerTitle}</h1>
              {subTab === 'personal' && (
                <span className="px-2.5 py-1 bg-[#14141F] border border-zinc-700 rounded-lg text-[11px] text-zinc-300 font-semibold">
                  {personalMsgCount} / 1000 Chats
                </span>
              )}
              {subTab === 'group' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-2.5 py-1 bg-[#14141F] hover:bg-zinc-800 text-[11px] font-bold text-white border border-zinc-700 rounded-lg"
                >
                  {tx.createGroupBtn}
                </button>
              )}
              {subTab === 'channel' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-2.5 py-1 bg-[#14141F] hover:bg-zinc-800 text-[11px] font-bold text-white border border-zinc-700 rounded-lg"
                >
                  {tx.createChannelBtn}
                </button>
              )}
            </div>

            {/* 3 Dark Mode Sub-Tabs: Personal | Groups (<=250) | Channels (Unlimited) */}
            <div className="grid grid-cols-3 gap-2">
              {['personal', 'group', 'channel'].map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setSubTab(tabKey)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    subTab === tabKey
                      ? 'bg-[#181826] text-white border-zinc-500'
                      : 'bg-[#08080E] text-zinc-400 border-zinc-800'
                  }`}
                >
                  {tabKey === 'personal'
                    ? tx.personalTab
                    : tabKey === 'group'
                    ? tx.groupTab
                    : tx.channelTab}
                </button>
              ))}
            </div>

            {/* Active SP Math Rule Banner */}
            <div className="p-2.5 bg-[#08080E] border border-zinc-800/90 rounded-xl text-[11px] text-zinc-300 leading-relaxed">
              {subTab === 'personal'
                ? tx.personalRule
                : subTab === 'group'
                ? tx.groupRule
                : tx.channelRule}
            </div>

            <div className="text-[11px] text-zinc-400">{tx.holdHint}</div>
          </div>

          {/* Room Cards List */}
          <div className="space-y-2.5">
            {filteredRooms.map((room) => {
              const spEarned =
                room.category === 'group'
                  ? calculateGroupSpReward(room.members, room.posts24h)
                  : room.category === 'channel'
                  ? calculateChannelSpReward(room.members, room.posts24h)
                  : 0;

              return (
                <div
                  key={room.id}
                  onMouseDown={() => startRoomHold(room)}
                  onMouseUp={cancelRoomHold}
                  onMouseLeave={cancelRoomHold}
                  onTouchStart={() => startRoomHold(room)}
                  onTouchEnd={cancelRoomHold}
                  onClick={() => setActiveRoomId(room.id)}
                  className="bg-[#0D0D14] hover:bg-[#12121C] border border-zinc-800 rounded-2xl p-3.5 cursor-pointer transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#14141F] border border-zinc-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {room.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{room.title}</span>
                        {room.pinned && (
                          <span className="px-1.5 py-0.5 bg-[#14141F] border border-zinc-700 rounded text-[10px] text-zinc-300">
                            {tx.pinnedBadge}
                          </span>
                        )}
                      </div>

                      {/* Holdable @username to trigger SP Tip Popup */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          onMouseDown={(e) => startUserHold(room.handle, e)}
                          onMouseUp={cancelUserHold}
                          onTouchStart={(e) => startUserHold(room.handle, e)}
                          onTouchEnd={cancelUserHold}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTipTargetUser(room.handle);
                          }}
                          className="text-[11px] text-emerald-400 hover:underline font-medium"
                        >
                          @{room.handle} (💸 Hold/Tap to Tip SP)
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {room.category === 'personal'
                          ? room.messages[room.messages.length - 1]?.text
                          : `${room.members}${room.category === 'group' ? '/250' : ''} Members • ${room.posts24h}/5 Posts (24h)`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-[10px] text-zinc-400">{room.lastTime}</div>
                    {spEarned > 0 && (
                      <button
                        type="button"
                        onClick={(e) => handleClaimRoomSp(room, e)}
                        className="px-2.5 py-1 bg-[#14141F] hover:bg-zinc-800 text-[10px] font-bold text-emerald-400 border border-zinc-700 rounded-lg"
                      >
                        +{spEarned} SP
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* VIEW 2: FULL-SCREEN SINGLE CHAT ROOM (Telegram Pattern — Zero Double Scrollbar) */
        <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-3.5 flex flex-col h-[72vh]">
          {/* Room Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveRoomId(null)}
                className="px-2.5 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl"
              >
                {tx.backToList}
              </button>
              <div>
                <div className="text-xs font-bold text-white">{activeRoom.title}</div>
                <div
                  onMouseDown={(e) => startUserHold(activeRoom.handle, e)}
                  onMouseUp={cancelUserHold}
                  onTouchStart={(e) => startUserHold(activeRoom.handle, e)}
                  onTouchEnd={cancelUserHold}
                  onClick={() => setTipTargetUser(activeRoom.handle)}
                  className="text-[11px] text-emerald-400 cursor-pointer hover:underline"
                >
                  @{activeRoom.handle} • Hold to Send SP Tip
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHoldTargetRoom(activeRoom)}
              className="px-2.5 py-1 bg-[#14141F] text-xs text-zinc-300 border border-zinc-700 rounded-lg"
            >
              •••
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {activeRoom.messages.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-[#08080E] border border-zinc-800/90 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    onMouseDown={(e) => startUserHold(m.sender, e)}
                    onMouseUp={cancelUserHold}
                    onTouchStart={(e) => startUserHold(m.sender, e)}
                    onTouchEnd={cancelUserHold}
                    onClick={() => setTipTargetUser(m.sender)}
                    className="text-[11px] font-bold text-emerald-400 cursor-pointer hover:underline"
                  >
                    @{m.sender}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {m.time} • ✓✓ {m.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="mt-3 pt-2 border-t border-zinc-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={tx.msgPlaceholder}
              className="flex-1 bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
            >
              {tx.sendBtn}
            </button>
          </form>
        </div>
      )}

      {/* 3-BUTTON HOLD POPUP: Pin | Unpin | Delete */}
      {holdTargetRoom && (
        <div className="fixed inset-0 z-[8800] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-2.5 shadow-2xl">
            <div className="text-xs font-bold text-white border-b border-zinc-800 pb-2">
              {tx.holdMenuTitle}: {holdTargetRoom.title}
            </div>
            <button
              type="button"
              onClick={() => handlePinToggle(true)}
              className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              {tx.pinBtn}
            </button>
            <button
              type="button"
              onClick={() => handlePinToggle(false)}
              className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl"
            >
              {tx.unpinBtn}
            </button>
            <button
              type="button"
              onClick={handleDeleteRoom}
              className="w-full py-2.5 bg-[#14141F] hover:bg-red-950/60 text-xs font-semibold text-red-300 border border-zinc-700 rounded-xl"
            >
              {tx.deleteBtn}
            </button>
            <button
              type="button"
              onClick={() => setHoldTargetRoom(null)}
              className="w-full py-2 bg-[#08080E] text-xs text-zinc-400 rounded-xl"
            >
              {tx.cancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* HOLD @USERNAME POPUP: SEND SP TIP */}
      {tipTargetUser && (
        <div className="fixed inset-0 z-[8900] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white">{tx.tipModalTitle}</span>
              <button
                onClick={() => setTipTargetUser(null)}
                className="px-2 py-0.5 bg-[#14141F] text-xs text-zinc-300 rounded border border-zinc-700"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              Recipient: @{tipTargetUser}
            </div>
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
                className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl"
              >
                {tx.sendTipNowBtn}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GROUP (<=250) OR UNLIMITED CHANNEL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[8850] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-white">
                {subTab === 'group' ? tx.createModalGroup : tx.createModalChannel}
              </span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-2 py-0.5 bg-[#14141F] text-xs text-zinc-300 rounded border border-zinc-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateRoom} className="space-y-2.5">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder={tx.namePh}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <input
                type="number"
                value={newRoomMembers}
                onChange={(e) => setNewRoomMembers(e.target.value)}
                placeholder={tx.membersPh}
                max={subTab === 'group' ? 250 : 1000000}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl"
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
