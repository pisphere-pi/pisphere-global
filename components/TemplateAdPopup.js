import React, { useEffect, useState } from "react";

export default function TemplateAdPopup({ templateAd, onClose, onAction }) {
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    if (!templateAd) return;
    setSecondsLeft(4);
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [templateAd]);

  if (!templateAd || !templateAd.active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm rounded-3xl p-5 border-2 border-[#e2be5a]/60 shadow-[0_0_50px_rgba(226,190,90,0.25)] relative text-center space-y-3">
        {/* 4-Second Locked Cut Button */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-900/80 text-[#f3d98b] px-2.5 py-1 rounded-full border border-[#e2be5a]/40">
            ✨ {templateAd.badge || "FEATURED TEMPLATE AD"}
          </span>

          {secondsLeft > 0 ? (
            <span className="text-[11px] bg-black/70 text-gray-300 px-3 py-1 rounded-full font-bold border border-white/15">
              ⏳ Wait {secondsLeft}s
            </span>
          ) : (
            <button
              onClick={onClose}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg"
            >
              ✕ Cut / Close
            </button>
          )}
        </div>

        {/* Center Visual Template Card */}
        <div className="py-4 px-3 rounded-2xl bg-gradient-to-b from-purple-950/90 to-black border border-purple-500/30 space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl soft-gold-btn flex items-center justify-center text-2xl shadow-md">
            <i className={`fa-solid ${templateAd.icon || "fa-bullhorn"}`} />
          </div>
          <h3 className="text-lg font-extrabold text-white mt-2">{templateAd.title}</h3>
          <p className="text-xs text-purple-200 leading-relaxed">{templateAd.subtitle}</p>
          <div className="inline-block bg-[#e2be5a]/20 border border-[#e2be5a]/50 text-[#f3d98b] text-xs font-extrabold px-3 py-1 rounded-lg">
            {templateAd.offerHighlight}
          </div>
        </div>

        <button
          onClick={() => {
            if (onAction) onAction(templateAd);
            if (secondsLeft === 0) onClose();
          }}
          className="w-full py-2.5 rounded-xl soft-gold-btn text-xs font-extrabold shadow-lg"
        >
          {templateAd.ctaText || "Connect Now"} →
        </button>
      </div>
    </div>
  );
}
Displaying 1000467041.png. 
