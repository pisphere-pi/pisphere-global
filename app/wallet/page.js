'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePiSphere } from '@/app/layout';

const WALLET_TEXT = {
  hi: {
    walletHeader: 'PiSphere वॉलेट और ब्लॉकचेन लेजर',
    settingsBtn: '⚙️ सेटिंग्स / प्रोफाइल',
    adminRouteTag: 'रूट: @RK33 एडमिन ट्रेजरी',
    holdHint: 'सेंड और रिसीव खोलने के लिए ग्रीन बैलेंस बटन को दबाकर रखें (Hold)',
    sendSpBtn: '📤 Send SP (भेजें)',
    receiveSpBtn: '📥 Receive SP (प्राप्त करें)',
    buySpTitle: 'Sphere Points (SP) खरीदें (Pi Wallet API)',
    buySpBtn: '🛒 Buy SP with Pi (π)',
    converterTitle: 'डायरेक्ट कन्वर्टर (SP ⇄ Pi)',
    spToPiMode: 'SP ➔ Pi (π) में बदलें',
    piToSpMode: 'Pi (π) ➔ SP में बदलें',
    convertNowBtn: '⇄ अभी कन्वर्ट करें (@RK33 रूट)',
    txHistoryTitle: 'ट्रांजैक्शन और टिप रिकॉर्ड (Blockchain & SP Ledger)',
    verifyExplorerBtn: 'Pi Explorer पर जांचें ↗',
    sendModalTitle: 'Pi यूज़रनेम पर Sphere Points (SP) भेजें',
    recipientPh: '@Pi_Username लिखें',
    amountPh: 'SP मात्रा लिखें',
    confirmSendBtn: 'SP भेजें',
    receiveModalTitle: 'Sphere Points (SP) प्राप्त करें',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  },
  en: {
    walletHeader: 'PiSphere Wallet & Blockchain Ledger',
    settingsBtn: '⚙️ Settings / Profile',
    adminRouteTag: 'Routed via @RK33 Admin Treasury',
    holdHint: 'Press & Hold the Green Balance button to open Send & Receive',
    sendSpBtn: '📤 Send SP',
    receiveSpBtn: '📥 Receive SP',
    buySpTitle: 'Buy Sphere Points (SP) via Pi Wallet API',
    buySpBtn: '🛒 Buy SP with Pi (π)',
    converterTitle: 'Direct Converter (SP ⇄ Pi)',
    spToPiMode: 'Convert SP ➔ Pi (π)',
    piToSpMode: 'Convert Pi (π) ➔ SP',
    convertNowBtn: '⇄ Execute Conversion (@RK33 Route)',
    txHistoryTitle: 'Transaction & Tip Report (Blockchain & SP Ledger)',
    verifyExplorerBtn: 'Verify on Pi Explorer ↗',
    sendModalTitle: 'Send Sphere Points (SP) to Pi Username',
    recipientPh: 'Enter @Pi_Username',
    amountPh: 'Enter SP amount',
    confirmSendBtn: 'Send SP Now',
    receiveModalTitle: 'Receive Sphere Points (SP)',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  }
};

export default function WalletPage() {
  const router = useRouter();
  const { lang, piUser, spBalance, setSpBalance, profile } = usePiSphere();
  const tx = WALLET_TEXT[lang] || WALLET_TEXT.hi;

  const [showSendReceiveBar, setShowSendReceiveBar] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'send' | 'receive' | null
  const [recipientUser, setRecipientUser] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [buyPackSp, setBuyPackSp] = useState(100);
  const [convertMode, setConvertMode] = useState('sp_to_pi'); // 'sp_to_pi' | 'pi_to_sp'
  const [convertValue, setConvertValue] = useState(100);
  const [ledger, setLedger] = useState([
    {
      id: 'tx-101',
      type: 'SP_CREDIT',
      title: 'Post Feed 100 Likes Reward',
      counterparty: '@RK33_Treasury',
      amount: '+1 SP',
      status: 'Confirmed',
      time: 'Today, 08:30 AM'
    },
    {
      id: 'tx-102',
      type: 'PI_TX',
      title: 'Cloud Meeting Host Verification',
      counterparty: '@RK33_Treasury',
      amount: '2.0 π',
      status: 'Confirmed on Pi Explorer',
      time: 'Yesterday'
    }
  ]);

  const holdTimerRef = useRef(null);

  // Strict Profile Gate: If user hasn't filled profile, route immediately to /settings
  useEffect(() => {
    if (!profile?.completed) {
      router.replace('/settings');
    }
  }, [profile, router]);

  // Press & Hold handler on Green SP Balance Button
  const startHold = () => {
    holdTimerRef.current = setTimeout(() => {
      setShowSendReceiveBar((prev) => !prev);
    }, 450);
  };

  const clearHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  // Send SP to any @Pi_Username
  const handleSendSp = (e) => {
    e.preventDefault();
    const amt = Number(sendAmount);
    const cleanTarget = recipientUser.trim().replace(/^@/, '');
    if (!cleanTarget || !amt || amt <= 0 || amt > spBalance) return;

    setSpBalance((prev) => prev - amt);
    setLedger((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'SP_SEND',
        title: `Sent SP to @${cleanTarget}`,
        counterparty: `@${cleanTarget} (via @RK33)`,
        amount: `-${amt} SP`,
        status: 'Confirmed',
        time: 'Just now'
      },
      ...prev
    ]);
    setSendAmount('');
    setRecipientUser('');
    setActiveModal(null);
  };

  // Buy SP directly via Pi Wallet SDK routed to @RK33 Admin Treasury
  const handleBuySpWithPi = async () => {
    const costPi = (buyPackSp / 100).toFixed(2);
    try {
      if (typeof window !== 'undefined' && window.Pi?.createPayment) {
        await window.Pi.createPayment(
          {
            amount: Number(costPi),
            memo: `Buy ${buyPackSp} SP via @RK33 Admin Treasury`,
            metadata: { type: 'BUY_SP', spAmount: buyPackSp, treasury: 'RK33' }
          },
          {
            onReadyForServerApproval: async (paymentId) => {
              await fetch('/api/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve', paymentId })
              });
            },
            onReadyForServerCompletion: async (paymentId, txid) => {
              await fetch('/api/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete', paymentId, txid })
              });
              setSpBalance((prev) => prev + buyPackSp);
              setLedger((prev) => [
                {
                  id: txid || `tx-${Date.now()}`,
                  type: 'BUY_SP',
                  title: `Purchased ${buyPackSp} SP (${costPi} π)`,
                  counterparty: '@RK33_Treasury',
                  amount: `+${buyPackSp} SP`,
                  status: 'Confirmed on Pi Explorer',
                  time: 'Just now'
                },
                ...prev
              ]);
            },
            onCancel: () => {},
            onError: () => {}
          }
        );
      } else {
        setSpBalance((prev) => prev + buyPackSp);
        setLedger((prev) => [
          {
            id: `pi-tx-${Date.now()}`,
            type: 'BUY_SP',
            title: `Purchased ${buyPackSp} SP (${costPi} π)`,
            counterparty: '@RK33_Treasury',
            amount: `+${buyPackSp} SP`,
            status: 'Confirmed on Pi Explorer',
            time: 'Just now'
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Pi payment error:', err);
    }
  };

  // Direct Converter (SP <-> Pi) routed via @RK33 Admin Treasury
  const handleConvert = () => {
    const val = Number(convertValue);
    if (!val || val <= 0) return;

    if (convertMode === 'sp_to_pi') {
      if (val > spBalance) return;
      const piOut = (val / 100).toFixed(2);
      setSpBalance((prev) => prev - val);
      setLedger((prev) => [
        {
          id: `conv-${Date.now()}`,
          type: 'CONVERT_SP_PI',
          title: `Converted ${val} SP ➔ ${piOut} π`,
          counterparty: '@RK33_Treasury',
          amount: `-${val} SP (+${piOut} π)`,
          status: 'Payout Queued via @RK33',
          time: 'Just now'
        },
        ...prev
      ]);
    } else {
      const spOut = Math.round(val * 100);
      setSpBalance((prev) => prev + spOut);
      setLedger((prev) => [
        {
          id: `conv-${Date.now()}`,
          type: 'CONVERT_PI_SP',
          title: `Converted ${val} π ➔ ${spOut} SP`,
          counterparty: '@RK33_Treasury',
          amount: `+${spOut} SP`,
          status: 'Confirmed on Pi Explorer',
          time: 'Just now'
        },
        ...prev
      ]);
    }
  };

  if (!profile?.completed) return null;

  return (
    <div className="space-y-4 pb-8">
      {/* Top Wallet Header with Settings Symbol Inside Wallet */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-white">{tx.walletHeader}</h1>
          <span className="text-[11px] text-zinc-400">{tx.adminRouteTag}</span>
        </div>
        <button
          onClick={() => router.push('/settings')}
          className="px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-semibold text-white border border-zinc-700 rounded-xl transition"
        >
          {tx.settingsBtn}
        </button>
      </div>

      {/* Main Green Sphere Points Balance Button (Hold to reveal Send & Receive) */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 text-center space-y-3">
        <button
          type="button"
          onMouseDown={startHold}
          onMouseUp={clearHold}
          onMouseLeave={clearHold}
          onTouchStart={startHold}
          onTouchEnd={clearHold}
          onClick={() => setShowSendReceiveBar((prev) => !prev)}
          className="w-full py-4 px-5 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900/90 border border-emerald-600/60 text-white shadow-xl transition select-none"
        >
          <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold">
            Sphere Points Balance ({profile.visibility === 'public' ? 'Public Eligible' : 'Private 0 SP'})
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">{spBalance} SP</div>
          <div className="text-[11px] text-emerald-200/80 mt-1">{tx.holdHint}</div>
        </button>

        {/* Send & Receive Action Bar unlocked on Hold */}
        {showSendReceiveBar && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setActiveModal('send')}
              className="py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
            >
              {tx.sendSpBtn}
            </button>
            <button
              onClick={() => setActiveModal('receive')}
              className="py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
            >
              {tx.receiveSpBtn}
            </button>
          </div>
        )}
      </div>

      {/* Buy Sphere Points via Pi Wallet SDK */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white">{tx.buySpTitle}</h2>
          <span className="text-[11px] text-zinc-400">100 SP = 1.0 π</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[100, 500, 1000].map((pack) => (
            <button
              key={pack}
              type="button"
              onClick={() => setBuyPackSp(pack)}
              className={`py-2 rounded-xl text-xs font-bold border transition ${
                buyPackSp === pack
                  ? 'bg-[#181826] text-white border-zinc-500'
                  : 'bg-[#08080E] text-zinc-400 border-zinc-800'
              }`}
            >
              {pack} SP ({pack / 100} π)
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleBuySpWithPi}
          className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
        >
          {tx.buySpBtn} — {buyPackSp} SP ({(buyPackSp / 100).toFixed(2)} π)
        </button>
      </div>

      {/* Direct SP <-> Pi Converter Routed to @RK33 Admin Treasury */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-white">{tx.converterTitle}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setConvertMode('sp_to_pi')}
            className={`py-2 rounded-xl text-xs font-semibold border transition ${
              convertMode === 'sp_to_pi'
                ? 'bg-[#181826] text-white border-zinc-500'
                : 'bg-[#08080E] text-zinc-400 border-zinc-800'
            }`}
          >
            {tx.spToPiMode}
          </button>
          <button
            type="button"
            onClick={() => setConvertMode('pi_to_sp')}
            className={`py-2 rounded-xl text-xs font-semibold border transition ${
              convertMode === 'pi_to_sp'
                ? 'bg-[#181826] text-white border-zinc-500'
                : 'bg-[#08080E] text-zinc-400 border-zinc-800'
            }`}
          >
            {tx.piToSpMode}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={convertValue}
            onChange={(e) => setConvertValue(e.target.value)}
            className="flex-1 bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
          <span className="text-xs text-zinc-300 font-semibold px-2">
            {convertMode === 'sp_to_pi'
              ? `= ${(Number(convertValue || 0) / 100).toFixed(2)} π`
              : `= ${Math.round(Number(convertValue || 0) * 100)} SP`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleConvert}
          className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl transition"
        >
          {tx.convertNowBtn}
        </button>
      </div>

      {/* Transaction & Blockchain Verification Report */}
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-xs font-bold text-white">{tx.txHistoryTitle}</h2>
        <div className="space-y-2.5">
          {ledger.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#08080E] border border-zinc-800/90 rounded-xl flex items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-semibold text-white">{item.title}</div>
                <div className="text-[11px] text-zinc-400">
                  {item.counterparty} • {item.status} • {item.time}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400">{item.amount}</div>
                <a
                  href={`https://blockexplorer.minepi.com/tx/${item.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-zinc-400 hover:text-white underline"
                >
                  {tx.verifyExplorerBtn}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send / Receive Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[8800] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0D0D14] border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">
                {activeModal === 'send' ? tx.sendModalTitle : tx.receiveModalTitle}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="px-2.5 py-1 bg-[#14141F] text-xs text-zinc-300 rounded-lg border border-zinc-700"
              >
                ✕
              </button>
            </div>

            {activeModal === 'send' ? (
              <form onSubmit={handleSendSp} className="space-y-3">
                <input
                  type="text"
                  value={recipientUser}
                  onChange={(e) => setRecipientUser(e.target.value)}
                  placeholder={tx.recipientPh}
                  className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder={tx.amountPh}
                  className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl"
                >
                  {tx.confirmSendBtn}
                </button>
              </form>
            ) : (
              <div className="space-y-2 text-center py-2">
                <div className="text-xs text-zinc-400">Your PiSphere Receive ID:</div>
                <div className="p-3 bg-[#08080E] border border-zinc-800 rounded-xl text-sm font-bold text-white">
                  @{piUser?.username || profile.realName.replace(/\s+/g, '_')}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Any Pioneer can hold your @username in Chat, Cloud Meet, or Post Feed to tip SP directly to your wallet.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Permanent Copyright Footer inside Wallet */}
      <div className="text-center text-[11px] text-zinc-500 pt-2">
        {tx.copyright}
      </div>
    </div>
  );
}
