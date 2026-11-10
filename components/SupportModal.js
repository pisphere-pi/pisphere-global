import React, { useState } from "react";

export default function SupportModal({ isOpen, onClose, currentUser, lang, tickets, onSendSupportMsg, t }) {
  const [category, setCategory] = useState("Cloud Meeting / Audio Issue");
  const [msgText, setMsgText] = useState("");

  if (!isOpen) return null;

  const myTicket = tickets.find((tk) => tk.username === currentUser.username);
  const myMessages = myTicket ? myTicket.messages : [];

  const handleSend = () => {
    if (!msgText.trim()) return;
    onSendSupportMsg(category, msgText.trim());
    setMsgText("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-2xl p-4 border border-[#e2be5a]/50 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl soft-gold-btn flex items-center justify-center text-base">
              <i className="fa-solid fa-headset" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">{t("support_modal_title")}</h3>
              <p className="text-[10px] text-purple-300">{t("support_modal_sub")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Auto-Attached User Identity Badge */}
        <div className="mt-2.5 bg-purple-950/60 border border-purple-500/30 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
          <span className="text-gray-200 font-bold">
            <i className="fa-solid fa-id-badge text-[#e2be5a] mr-1" /> @{currentUser.username}
          </span>
          <span className="text-purple-300">UID: {currentUser.uid} • Lang: {lang.toUpperCase()}</span>
        </div>

        {/* Issue Category Selector */}
        <div className="mt-2.5">
          <label className="text-[10px] text-gray-400 font-bold uppercase">{t("support_issue_type")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 bg-black/60 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white font-semibold"
          >
            <option value="Cloud Meeting / Audio Issue">📹 Cloud Meeting / Video Problem</option>
            <option value="Pi Payment / Summary Unlock">🪙 Pi Payment / Summary Unlock Issue</option>
            <option value="Publish Local Business Ad">📢 Publish Local Business Ad Inquiry</option>
            <option value="Account / Other Complaint">🛡️ Account / Other Complaint</option>
          </select>
        </div>

        {/* Direct 1-on-1 Chat History with Admin */}
        <div className="flex-1 overflow-y-auto my-3 bg-black/40 border border-white/10 rounded-xl p-3 space-y-2 min-h-[180px]">
          {myMessages.length === 0 ? (
            <p className="text-xs text-gray-400 text-center my-10">
              कोई भी समस्या या सवाल नीचे लिखें—आपका संदेश सीधे एडमिन पैनल पर फ्लैश होगा।
            </p>
          ) : (
            myMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl text-xs ${
                  m.fromAdmin
                    ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-100 ml-4"
                    : "bg-purple-950/70 border border-purple-500/30 text-white mr-4"
                }`}
              >
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className={m.fromAdmin ? "text-emerald-400" : "text-[#e2be5a]"}>
                    {m.fromAdmin ? "👑 PiSphere Admin Support" : `@${currentUser.username} (${m.category || "Query"})`}
                  </span>
                  <span className="text-gray-400">{m.time}</span>
                </div>
                <p>{m.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Box */}
        <div className="flex flex-col gap-2">
          <textarea
            rows={2}
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            placeholder={t("support_placeholder")}
            className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          />
          <button onClick={handleSend} className="w-full py-2.5 rounded-xl soft-gold-btn text-xs font-extrabold">
            <i className="fa-solid fa-paper-plane mr-1.5" /> {t("support_send_btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
Displaying 1000467041.png. 
