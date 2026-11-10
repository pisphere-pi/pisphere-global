import React, { useEffect, useState } from "react";
import Head from "next/head";
import { PiSphereConfig, LANGUAGE_LIST, getTranslator } from "../lib/piConfig";
import PromoOverlay from "../components/PromoOverlay";
import TemplateAdPopup from "../components/TemplateAdPopup";
import SupportModal from "../components/SupportModal";
import ChatModule from "../components/ChatModule";
import MeetingModule from "../components/MeetingModule";
import AdminModule from "../components/AdminModule";

export default function PiSphereHome() {
  const [showPromo, setShowPromo] = useState(true);
  const [legalAccepted, setLegalAccepted] = useState(true);
  const [legalCheck, setLegalCheck] = useState(false);
  const [lang, setLang] = useState("hi");
  const [activeTab, setActiveTab] = useState("chats");
  const [supportOpen, setSupportOpen] = useState(false);

  // User & Secret Owner Visibility Logic
  const [currentUser, setCurrentUser] = useState({ username: "Ranjeeth_Pi", uid: "PI-99204" });
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(true);
  const [logoTapCount, setLogoTapCount] = useState(0);

  const [rewardPoints, setRewardPoints] = useState(150);
  const [summaryPricePi, setSummaryPricePi] = useState(PiSphereConfig.defaultSummaryPricePi);
  const [summarySalesPi, setSummarySalesPi] = useState(18.5);

  // Center Screen 4-Second Locked Template Ad State
  const [templateAd, setTemplateAd] = useState(null);

  const [localAds, setLocalAds] = useState([
    { id: 1, business: "Sharma Coaching Classes", text: "100-Seat Live Pi Batch Starting Today!", active: true },
    { id: 2, business: "City Care Clinic", text: "Live Doctor Video Consultation @ 2 π Only", active: true }
  ]);

  const [summaries, setSummaries] = useState([
    {
      id: "sum_101",
      title: "PiSphere Web3 Global Launch & Business Meet",
      date: "Today • 88/100 Pioneers",
      host: "@Ranjeeth_Pi",
      pricePi: 0.5,
      unlockedByMe: false,
      preview: "1. लोकल दुकानदारों को क्लाउड मीटिंग बार में विज्ञापन देने का सिस्टम लाइव हुआ...",
      fullContent: `=== PISPHERE OFFICIAL AI MEETING SUMMARY (MOM) ===\nMeeting ID: PI-GLOBAL-100 | Attendance: 88/100 Pioneers\n\n1. सभी लोकल कोचिंग, डॉक्टर और दुकानदार अपनी सर्विस को 1 क्लिक में प्रमोट कर सकेंगे।\n2. 30 मिनट तक बेसिक कॉल फ्री रहेगी; 100 लोगों के अनलिमिटेड सेशन के लिए 2 Pi होस्ट पास लगेगा।\n3. हर यूजर अपनी जरूरत के अनुसार 0.5 Pi देकर यह पूरी समरी डाउनलोड कर सकता है।`
    }
  ]);

  // Multi-User Flashing Support Tickets Inbox
  const [supportTickets, setSupportTickets] = useState([
    {
      username: "Aman_Pioneer",
      uid: "PI-44812",
      lang: "HI",
      unread: true,
      messages: [
        {
          fromAdmin: false,
          category: "Publish Local Business Ad",
          text: "सर, मुझे अपनी इलेक्ट्रॉनिक्स दुकान का विज्ञापन क्लाउड मीटिंग बार में चलाना है, कैसे पेमेंट करूँ?",
          time: "10:12 AM"
        }
      ]
    },
    {
      username: "Sophia_Web3",
      uid: "PI-77309",
      lang: "EN",
      unread: true,
      messages: [
        {
          fromAdmin: false,
          category: "Pi Payment / Summary Unlock",
          text: "Hello Admin, I want to book a 100-user meeting pass for our global crypto class.",
          time: "10:25 AM"
        }
      ]
    }
  ]);

  const [safetyReports, setSafetyReports] = useState([
    { id: 101, reason: "Unverified external link shared by @SpamBot_99 in public room" }
  ]);

  const t = getTranslator(lang);

  useEffect(() => {
    const savedLegal = localStorage.getItem("pisphere_legal_v3");
    if (!savedLegal) setLegalAccepted(false);

    async function initPi() {
      try {
        if (window.Pi) {
          window.Pi.init({ version: "2.0", sandbox: PiSphereConfig.sandboxMode });
          const auth = await window.Pi.authenticate(["username", "payments"], () => {});
          if (auth && auth.user) {
            setCurrentUser({ username: auth.user.username, uid: auth.user.uid || "PI-USER" });
            setIsOwnerUnlocked(auth.user.username === PiSphereConfig.ownerUsername);
          }
        }
      } catch (e) {}
    }
    initPi();
  }, []);

  // Secret 5-Tap Logo Unlock for Owner Key
  const handleSecretLogoTap = () => {
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);
    if (nextCount >= 5) {
      setLogoTapCount(0);
      const key = prompt("🔐 Enter PiSphere Secret Owner Key:");
      if (key === PiSphereConfig.ownerSecretKey) {
        setIsOwnerUnlocked(true);
        setActiveTab("admin");
      }
    }
  };

  // User Sends Direct Support Message -> Flashes in Admin Panel
  const handleSendSupportMsg = async (category, text) => {
    const newMsg = {
      fromAdmin: false,
      category,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const existing = supportTickets.find((tk) => tk.username === currentUser.username);
    if (existing) {
      setSupportTickets(
        supportTickets.map((tk) =>
          tk.username === currentUser.username
            ? { ...tk, unread: true, messages: [...tk.messages, newMsg] }
            : tk
        )
      );
    } else {
      setSupportTickets([
        {
          username: currentUser.username,
          uid: currentUser.uid,
          lang: lang.toUpperCase(),
          unread: true,
          messages: [newMsg]
        },
        ...supportTickets
      ]);
    }

    try {
      await fetch(PiSphereConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "support_ticket",
          username: currentUser.username,
          uid: currentUser.uid,
          lang: lang.toUpperCase(),
          category,
          text
        })
      });
    } catch (e) {}
  };

  // Admin Replies to Specific User Thread
  const handleAdminReplyTicket = async (targetUsername, replyText) => {
    const replyMsg = {
      fromAdmin: true,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setSupportTickets(
      supportTickets.map((tk) =>
        tk.username === targetUsername
          ? { ...tk, unread: false, messages: [...tk.messages, replyMsg] }
          : tk
      )
    );
  };

  const tickerString =
    localAds.length > 0
      ? localAds.map((a) => `🔥 [${a.business}] ${a.text}`).join("   •   ")
      : "📢 Book Your Local Business Ad Here via PiSphere Admin!";

  const unreadSupportCount = supportTickets.filter((tk) => tk.unread).length;

  return (
    <div className="min-h-screen flex flex-col select-none">
      <Head>
        <title>PiSphere — Web3 Cloud Meetings, Chat & Local Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      {/* 1. AUTO-RUN 3D AI HUMAN FACES & ROTATING GLOBE PROMO (NO HEADER BUTTON) */}
      {showPromo && <PromoOverlay onFinish={() => setShowPromo(false)} />}

      {/* 2. 4-SECOND LOCKED POPUP TEMPLATE AD OVERLAY */}
      <TemplateAdPopup
        templateAd={templateAd}
        onClose={() => setTemplateAd(null)}
        onAction={() => setSupportOpen(true)}
      />

      {/* 3. DIRECT USER-TO-ADMIN SUPPORT CHAT MODAL */}
      <SupportModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
        currentUser={currentUser}
        lang={lang}
        tickets={supportTickets}
        onSendSupportMsg={handleSendSupportMsg}
        t={t}
      />

      {/* 4. LEGAL CONSENT MODAL */}
      {!showPromo && !legalAccepted && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-5 border border-[#e2be5a]/40 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo.png" alt="PiSphere" className="w-11 h-11 rounded-full object-cover border border-[#e2be5a]" />
              <div>
                <h2 className="text-base font-extrabold text-white">{t("legal_title")}</h2>
                <p className="text-[11px] text-purple-300">Global Safe-Harbor (IT Act Sec 79, GDPR & CCPA)</p>
              </div>
            </div>
            <label className="flex items-start gap-2.5 mt-4 cursor-pointer text-xs text-gray-200">
              <input
                type="checkbox"
                checked={legalCheck}
                onChange={(e) => setLegalCheck(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#e2be5a] rounded"
              />
              <span>{t("legal_agree")}</span>
            </label>
            <button
              onClick={() => {
                if (!legalCheck) return;
                localStorage.setItem("pisphere_legal_v3", "accepted");
                setLegalAccepted(true);
              }}
              className="w-full mt-4 py-2.5 rounded-xl soft-gold-btn text-sm font-extrabold"
            >
              {t("accept_continue")}
            </button>
          </div>
        </div>
      )}

      {/* 5. COMPACT TOP HEADER BAR (NO PROMO BUTTON, INCLUDES DIRECT SUPPORT & 42 LANGUAGES) */}
      <header className="sticky top-0 z-30 glass-card border-b border-purple-500/20 px-3 py-2">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1">
          <div onClick={handleSecretLogoTap} className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo.png"
              alt="PiSphere Official Logo"
              className="w-9 h-9 rounded-full object-cover border border-[#e2be5a] shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  Pi<span className="text-[#e2be5a]">Sphere</span>
                </span>
                <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 py-0.5 rounded font-bold">
                  WEB3
                </span>
              </div>
              <p className="text-[10px] text-purple-300 truncate max-w-[115px]">@{currentUser.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* 42-Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-purple-950/90 text-[11px] text-[#f3d98b] border border-purple-500/40 rounded-lg px-1.5 py-1.5 font-bold max-w-[92px]"
            >
              {LANGUAGE_LIST.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>

            {/* Direct User Support Chat Button */}
            <button
              onClick={() => setSupportOpen(true)}
              className="px-2.5 py-1.5 rounded-lg soft-gold-btn text-[10px] font-extrabold flex items-center gap-1"
            >
              <i className="fa-solid fa-headset" />
              <span>{t("support_btn")}</span>
            </button>

            {/* Secret Owner Admin Button (Only visible to Owner) */}
            {isOwnerUnlocked && (
              <button
                onClick={() => setActiveTab("admin")}
                className="relative w-8 h-8 rounded-lg bg-[#e2be5a]/20 border border-[#e2be5a]/50 text-[#e2be5a] flex items-center justify-center text-xs"
              >
                <i className="fa-solid fa-crown" />
                {unreadSupportCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-ping" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 6. LIVE LOCAL AD TICKER BAR */}
      <div className="bg-gradient-to-r from-amber-950/80 via-purple-950/95 to-amber-950/80 border-b border-[#e2be5a]/30 py-1.5 px-2 overflow-hidden">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <span className="soft-gold-btn text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0">
            {t("local_ad_badge")}
          </span>
          <div className="overflow-hidden w-full">
            <div className="animate-ticker text-xs text-[#f3d98b] font-medium">{tickerString}</div>
          </div>
          <button
            onClick={() => setSupportOpen(true)}
            className="bg-[#e2be5a]/20 border border-[#e2be5a]/40 text-[#f3d98b] text-[10px] px-2 py-0.5 rounded shrink-0 font-bold"
          >
            {t("chat_btn")}
          </button>
        </div>
      </div>

      {/* 7. MAIN TAB VIEW */}
      <main className="flex-1 max-w-md w-full mx-auto p-3 pb-24">
        {(activeTab === "chats" || activeTab === "feed" || activeTab === "wallet") && (
          <ChatModule
            mode={activeTab}
            currentUser={currentUser}
            rewardPoints={rewardPoints}
            addPoints={(pts) => setRewardPoints(rewardPoints + pts)}
            onSwitchToMeeting={() => setActiveTab("meetings")}
            onReport={() => setSupportOpen(true)}
            t={t}
          />
        )}

        {activeTab === "meetings" && (
          <MeetingModule
            currentUser={currentUser}
            summaries={summaries}
            setSummaries={setSummaries}
            tickerText={tickerString}
            summaryPricePi={summaryPricePi}
            onSaleRecorded={(amt) => setSummarySalesPi(summarySalesPi + amt)}
            t={t}
          />
        )}

        {activeTab === "admin" && isOwnerUnlocked && (
          <AdminModule
            localAds={localAds}
            setLocalAds={setLocalAds}
            summaryPricePi={summaryPricePi}
            setSummaryPricePi={setSummaryPricePi}
            safetyReports={safetyReports}
            setSafetyReports={setSafetyReports}
            summarySalesPi={summarySalesPi}
            supportTickets={supportTickets}
            onAdminReplyTicket={handleAdminReplyTicket}
            onLaunchTemplateAd={(tpl) => setTemplateAd(tpl)}
            t={t}
          />
        )}
      </main>

      {/* 8. BOTTOM NAVIGATION BAR (Admin Tab Hidden for Regular Users) */}
      <nav className="fixed bottom-0 inset-x-0 z-30 glass-card border-t border-purple-500/30 px-2 py-1.5">
        <div className={`max-w-md mx-auto grid ${isOwnerUnlocked ? "grid-cols-5" : "grid-cols-4"} gap-1`}>
          {[
            { id: "chats", icon: "fa-comments", label: t("nav_chats") },
            { id: "meetings", icon: "fa-video", label: t("nav_meetings") },
            { id: "feed", icon: "fa-earth-asia", label: t("nav_feed") },
            { id: "wallet", icon: "fa-wallet", label: t("nav_wallet") },
            ...(isOwnerUnlocked ? [{ id: "admin", icon: "fa-crown", label: t("nav_admin") }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1.5 rounded-xl relative ${
                activeTab === tab.id ? "text-[#e2be5a] bg-purple-900/40" : "text-gray-400 hover:text-white"
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-base`} />
              <span className="text-[10px] font-bold mt-0.5 truncate max-w-[64px]">{tab.label}</span>
              {tab.id === "admin" && unreadSupportCount > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
Displaying 1000467041.png. 
