import React, { useState } from "react";
import { PiSphereConfig, payWithPiSDK, triggerPiAd } from "../lib/piConfig";

export default function MeetingModule({ currentUser, summaries, setSummaries, tickerText, summaryPricePi, onSaleRecorded, t }) {
  const [isLive, setIsLive] = useState(false);
  const [lowDataAudio, setLowDataAudio] = useState(false);
  const participantCount = 88;

  const handleEndAndSummarize = async () => {
    setIsLive(false);
    const topic = prompt("Enter Meeting Topic for AI Summary Vault:", "PiSphere Cloud Business & Local Ad Strategy");
    if (topic && topic.trim()) {
      const newSum = {
        id: "sum_" + Date.now(),
        title: topic.trim(),
        date: `Just Now • ${participantCount}/100 Pioneers`,
        host: "@" + (currentUser.username || "Ranjeeth_Pi"),
        pricePi: summaryPricePi,
        unlockedByMe: false,
        preview: `1. '${topic.trim()}' के मुख्य निर्णय और एक्शन पॉइंट्स तैयार हो चुके हैं...`,
        fullContent: `=== PISPHERE OFFICIAL AI MEETING SUMMARY (MOM) ===\nTopic: ${topic.trim()}\nHost: @${currentUser.username}\nAttendance: ${participantCount}/100 Pioneers\n\n1. मीटिंग के सभी मुख्य बिंदु और लोकल बिजनेस प्रस्ताव मंजूर किए गए।\n2. हर सदस्य अपनी आवश्यकता अनुसार इस आधिकारिक समरी को डाउनलोड कर सकता है।\n3. Verified by PiSphere Admin Vault.`
      };
      setSummaries([newSum, ...summaries]);
      try {
        await fetch(PiSphereConfig.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "summary", ...newSum })
        });
      } catch (e) {}
    }
    triggerPiAd("interstitial");
  };

  const handleUnlockSummary = (sumItem) => {
    payWithPiSDK(
      sumItem.pricePi,
      `Unlock AI Meeting Summary: ${sumItem.title}`,
      { summaryId: sumItem.id },
      currentUser.username,
      () => {
        setSummaries(summaries.map((s) => (s.id === sumItem.id ? { ...s, unlockedByMe: true } : s)));
        if (onSaleRecorded) onSaleRecorded(sumItem.pricePi);
      }
    );
  };

  const handleDownloadTxt = (sumItem) => {
    const blob = new Blob([sumItem.fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sumItem.title.replace(/\s+/g, "_")}_Summary.txt`;
    a.click();
  };

  return (
    <div className="space-y-3">
      <div className="glass-card rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-extrabold text-white">{t("meet_heading")}</h2>
            <p className="text-[11px] text-purple-300">
              {t("room_id_label")}: <strong className="text-[#e2be5a]">PI-GLOBAL-100</strong> • {t("free_tier_label")}
            </p>
          </div>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isLive ? "bg-rose-600 text-white animate-pulse" : "bg-emerald-500/20 text-emerald-300"}`}>
            {isLive ? `● LIVE (${participantCount}/100)` : t("ready_badge")}
          </span>
        </div>

        {!isLive ? (
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <button
              onClick={() => setIsLive(true)}
              className="p-3.5 rounded-2xl soft-gold-btn text-xs font-extrabold flex flex-col items-center gap-1.5 shadow-md"
            >
              <i className="fa-solid fa-video text-base" />
              <span>{t("start_meet_btn")}</span>
            </button>
            <button
              onClick={() => payWithPiSDK(2.0, "100-User Pro Host Pass", { type: "host_pass" }, currentUser.username)}
              className="p-3.5 rounded-2xl bg-purple-900/60 border border-[#e2be5a]/40 text-[#f3d98b] font-extrabold text-xs flex flex-col items-center gap-1.5"
            >
              <i className="fa-solid fa-crown text-base" />
              <span>{t("pro_host_btn")}</span>
            </button>
          </div>
        ) : (
          <div className="mt-2.5 bg-[#06040c] border border-purple-500/40 rounded-xl p-2.5 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-gray-300">
              <span>🎙️ {t("active_speakers_label")}</span>
              <button
                onClick={() => setLowDataAudio(!lowDataAudio)}
                className="px-2 py-0.5 rounded bg-purple-800 text-[#f3d98b] font-bold"
              >
                {lowDataAudio ? t("audio_only_mode") : t("hd_video_mode")}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {["@Ranjeeth_Pi", "@Dr_Verma", "@Tiya_Web3", "@Sharma_Sir"].map((sp, i) => (
                <div
                  key={sp}
                  className={`h-24 rounded-xl bg-gradient-to-br from-purple-950 to-black border ${
                    i === 0 ? "border-[#e2be5a]" : "border-purple-500/30"
                  } flex flex-col items-center justify-center`}
                >
                  <img src="/logo.png" alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-[#e2be5a]" />
                  <span className="text-[10px] text-white font-bold mt-1">{sp}</span>
                  <span className="text-[9px] text-emerald-400">{lowDataAudio ? "🔊 Voice" : "🎥 HD"}</span>
                </div>
              ))}
            </div>

            {/* Live Local Ad Bar inside Meeting Bottom */}
            <div className="bg-[#e2be5a]/15 border border-[#e2be5a]/40 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-[10px] text-[#f3d98b] truncate">📢 {tickerText}</span>
              <span className="text-[9px] soft-gold-btn px-1.5 py-0.5 rounded font-extrabold ml-1">AD</span>
            </div>

            <button
              onClick={handleEndAndSummarize}
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs"
            >
              {t("end_meet_btn")}
            </button>
          </div>
        )}
      </div>

      {/* Paid AI Meeting Summary Vault */}
      <div className="glass-card rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#e2be5a] uppercase tracking-wider">
            <i className="fa-solid fa-file-lines mr-1.5" /> {t("summary_vault_heading")}
          </h3>
          <span className="text-[10px] text-purple-300">
            {summaryPricePi} π / {t("per_user_label")}
          </span>
        </div>

        {summaries.map((s) => (
          <div key={s.id} className="bg-black/45 border border-[#e2be5a]/30 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-extrabold text-white">{s.title}</h4>
                <p className="text-[10px] text-purple-300 mt-0.5">{s.date} • Host: {s.host}</p>
              </div>
              <span className="text-[10px] bg-[#e2be5a]/20 text-[#f3d98b] border border-[#e2be5a]/40 px-2.5 py-1 rounded-lg font-extrabold shrink-0">
                {s.unlockedByMe ? t("unlocked_badge") : `${s.pricePi} π`}
              </span>
            </div>

            {!s.unlockedByMe ? (
              <>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {s.preview} <span className="text-[#e2be5a] font-bold">{t("locked_mom_tag")}</span>
                </p>
                <button
                  onClick={() => handleUnlockSummary(s)}
                  className="w-full py-2.5 px-3 rounded-xl soft-gold-btn text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
                >
                  <i className="fa-solid fa-lock-open" />
                  <span>{t("unlock_summary_btn")} ({s.pricePi} π)</span>
                </button>
              </>
            ) : (
              <>
                <pre className="text-[11px] text-emerald-200 bg-black/60 p-2.5 rounded-lg whitespace-pre-wrap font-sans border border-emerald-500/30">
                  {s.fullContent}
                </pre>
                <button
                  onClick={() => handleDownloadTxt(s)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
                >
                  <i className="fa-solid fa-download mr-1.5" /> {t("download_txt_btn")}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
Displaying 1000467041.png. 
