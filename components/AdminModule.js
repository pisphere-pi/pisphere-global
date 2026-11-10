import React, { useState } from "react";
import { PiSphereConfig } from "../lib/piConfig";

export default function AdminModule({
  localAds,
  setLocalAds,
  summaryPricePi,
  setSummaryPricePi,
  safetyReports,
  setSafetyReports,
  summarySalesPi,
  supportTickets,
  onAdminReplyTicket,
  onLaunchTemplateAd,
  t
}) {
  const [bizName, setBizName] = useState("");
  const [adMsg, setAdMsg] = useState("");
  const [adRevenuePi, setAdRevenuePi] = useState(35.0);

  // Support Chat Selected User Thread
  const [selectedTicketUser, setSelectedTicketUser] = useState(
    supportTickets[0]?.username || null
  );
  const [replyText, setReplyText] = useState("");

  // Popup Template Ad Builder State
  const [tplTitle, setTplTitle] = useState("Grand Local Mega Sale!");
  const [tplSubtitle, setTplSubtitle] = useState("100% Verified Pi Network Partner Store in Your City");
  const [tplHighlight, setTplHighlight] = useState("Flat 30% OFF with Pi Coin Payment");
  const [tplCta, setTplCta] = useState("Claim Offer Now");

  const handleCreateAd = async () => {
    if (!bizName.trim() || !adMsg.trim()) return;
    const newAd = { id: Date.now(), business: bizName.trim(), text: adMsg.trim(), active: true };
    setLocalAds([newAd, ...localAds]);
    setAdRevenuePi(adRevenuePi + 5.0);
    setBizName("");
    setAdMsg("");
    try {
      await fetch(PiSphereConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ad", ...newAd })
      });
    } catch (e) {}
  };

  const handleSendReply = () => {
    if (!selectedTicketUser || !replyText.trim()) return;
    onAdminReplyTicket(selectedTicketUser, replyText.trim());
    setReplyText("");
  };

  const activeTicket = supportTickets.find((tk) => tk.username === selectedTicketUser);

  return (
    <div className="glass-card rounded-2xl p-4 border border-[#e2be5a]/50 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-[#e2be5a]">
            <i className="fa-solid fa-crown mr-1.5" /> {t("admin_heading")}
          </h2>
          <p className="text-[10px] text-purple-300">{t("admin_sub")}</p>
        </div>
        <span className="text-[10px] soft-gold-btn px-2.5 py-0.5 rounded font-extrabold">OWNER ONLY</span>
      </div>

      {/* Revenue Counters */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-black/50 border border-[#e2be5a]/30 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400">{t("summary_earned_label")}</p>
          <p className="text-base font-extrabold text-[#e2be5a]">{summarySalesPi.toFixed(1)} π</p>
        </div>
        <div className="bg-black/50 border border-purple-500/30 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400">{t("ads_earned_label")}</p>
          <p className="text-base font-extrabold text-emerald-400">{adRevenuePi.toFixed(1)} π</p>
        </div>
      </div>

      {/* 1. LIVE USER SUPPORT & FLASHING COMPLAINTS INBOX (MULTI-USER THREADS) */}
      <div className="bg-black/45 border-2 border-[#e2be5a]/40 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <i className="fa-solid fa-headset text-[#e2be5a]" />
            <span>{t("support_inbox_heading")}</span>
          </h3>
          <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-extrabold animate-pulse">
            {supportTickets.filter((tk) => tk.unread).length} Flashing
          </span>
        </div>

        {/* Flashing User Thread Selector Cards */}
        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
          {supportTickets.map((tk) => (
            <div
              key={tk.username}
              onClick={() => setSelectedTicketUser(tk.username)}
              className={`p-2 rounded-xl cursor-pointer border transition flex items-center justify-between ${
                tk.unread
                  ? "bg-rose-950/50 border-rose-500 animate-pulse"
                  : selectedTicketUser === tk.username
                  ? "bg-purple-900/60 border-[#e2be5a]"
                  : "bg-black/50 border-white/10"
              }`}
            >
              <div>
                <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <span>@{tk.username}</span>
                  <span className="text-[9px] text-purple-300 font-normal">({tk.uid})</span>
                </p>
                <p className="text-[10px] text-gray-300 truncate max-w-[210px]">
                  {tk.messages[tk.messages.length - 1]?.text}
                </p>
              </div>
              <div className="text-right shrink-0">
                {tk.unread ? (
                  <span className="text-[9px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                    NEW COMPLAINT
                  </span>
                ) : (
                  <span className="text-[9px] text-emerald-400 font-bold">Replied</span>
                )}
                <p className="text-[9px] text-gray-400 mt-0.5">Lang: {tk.lang}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected User Chat Thread & Admin Direct Reply */}
        {activeTicket && (
          <div className="bg-black/65 border border-purple-500/30 rounded-xl p-2.5 space-y-2">
            <div className="flex justify-between text-[10px] text-[#e2be5a] font-bold border-b border-white/10 pb-1">
              <span>Chatting with @{activeTicket.username} (UID: {activeTicket.uid})</span>
              <span>{activeTicket.messages.length} msgs</span>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
              {activeTicket.messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-[11px] ${
                    m.fromAdmin ? "bg-emerald-950/80 text-emerald-200 ml-4" : "bg-purple-950/80 text-white mr-4"
                  }`}
                >
                  <strong>{m.fromAdmin ? "You (Admin): " : `@${activeTicket.username}: `}</strong>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-1">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                type="text"
                placeholder={`@${activeTicket.username} को सीधा जवाब लिखें...`}
                className="flex-1 bg-black/70 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
              <button onClick={handleSendReply} className="soft-gold-btn px-3 py-1.5 rounded-lg text-xs font-extrabold">
                {t("reply_btn")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. MAIN SCREEN POPUP TEMPLATE AD STUDIO (4-SECOND LOCK) */}
      <div className="bg-black/45 border border-purple-500/30 rounded-xl p-3 space-y-2">
        <h3 className="text-xs font-extrabold text-white">
          <i className="fa-solid fa-wand-magic-sparkles text-[#e2be5a] mr-1.5" />
          {t("template_studio_heading")}
        </h3>
        <input
          value={tplTitle}
          onChange={(e) => setTplTitle(e.target.value)}
          type="text"
          placeholder="Template Heading..."
          className="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white"
        />
        <input
          value={tplSubtitle}
          onChange={(e) => setTplSubtitle(e.target.value)}
          type="text"
          placeholder="Template Subtitle..."
          className="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white"
        />
        <input
          value={tplHighlight}
          onChange={(e) => setTplHighlight(e.target.value)}
          type="text"
          placeholder="Offer Badge (e.g. 30% OFF in Pi)..."
          className="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white"
        />
        <button
          onClick={() =>
            onLaunchTemplateAd({
              active: true,
              badge: "ADMIN TEMPLATE PROMO",
              icon: "fa-bolt",
              title: tplTitle,
              subtitle: tplSubtitle,
              offerHighlight: tplHighlight,
              ctaText: tplCta
            })
          }
          className="w-full py-2.5 rounded-xl soft-gold-btn text-xs font-extrabold"
        >
          <i className="fa-solid fa-rocket mr-1.5" /> {t("launch_template_btn")}
        </button>
      </div>

      {/* 3. LOCAL AD BAR STUDIO */}
      <div className="bg-black/45 border border-purple-500/30 rounded-xl p-3 space-y-2">
        <h3 className="text-xs font-extrabold text-white">
          <i className="fa-solid fa-rectangle-ad text-[#e2be5a] mr-1.5" /> {t("local_ad_studio_heading")}
        </h3>
        <input
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
          type="text"
          placeholder={t("biz_name_placeholder")}
          className="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white"
        />
        <input
          value={adMsg}
          onChange={(e) => setAdMsg(e.target.value)}
          type="text"
          placeholder={t("ad_msg_placeholder")}
          className="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white"
        />
        <button onClick={handleCreateAd} className="w-full py-2 rounded-xl soft-gold-btn text-xs font-extrabold">
          {t("publish_ad_btn")}
        </button>

        <div className="space-y-1.5 pt-2">
          {localAds.map((ad) => (
            <div key={ad.id} className="flex items-center justify-between bg-black/50 px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px]">
              <span className="truncate text-gray-200">
                <strong>{ad.business}:</strong> {ad.text}
              </span>
              <button
                onClick={() => setLocalAds(localAds.filter((a) => a.id !== ad.id))}
                className="text-rose-400 font-bold ml-2"
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SUMMARY PRICE CONTROLLER */}
      <div className="bg-black/45 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold text-white">{t("summary_price_heading")}</h3>
          <p className="text-[10px] text-gray-400">{t("summary_price_sub")}</p>
        </div>
        <input
          type="number"
          step="0.1"
          value={summaryPricePi}
          onChange={(e) => setSummaryPricePi(parseFloat(e.target.value) || 0.5)}
          className="w-20 bg-black border border-[#e2be5a] rounded-lg px-2 py-1 text-xs text-[#f3d98b] font-bold text-center"
        />
      </div>

      {/* 5. SAFETY REPORTS & KILL-SWITCH */}
      <div className="bg-black/45 border border-rose-500/30 rounded-xl p-3 space-y-2">
        <h3 className="text-xs font-extrabold text-rose-300">
          <i className="fa-solid fa-shield-halved mr-1.5" /> {t("safety_heading")}
        </h3>
        {safetyReports.map((r) => (
          <div key={r.id} className="flex items-center justify-between bg-black/50 p-2 rounded-lg text-[11px]">
            <span className="text-gray-300">{r.reason}</span>
            <button
              onClick={() => setSafetyReports(safetyReports.filter((item) => item.id !== r.id))}
              className="bg-rose-600 text-white px-2.5 py-1 rounded-lg font-bold shrink-0 ml-2"
            >
              {t("block_id_btn")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
Displaying 1000467041.png. 
