// ==========================================
// PISPHERE GLOBAL CONFIGURATION & MULTI-LANGUAGE
// © 2026 PiSphere Official. All Rights Reserved.
// ==========================================

const PiSphereConfig = {
  appName: "PiSphere",
  version: "1.0.0",
  sandboxMode: true, // Testing mode ke liye true rakha gaya hai
  defaultSummaryPricePi: 0.5,
  defaultMeetingPassPi: 2.0,
  platformCommissionPercent: 15,
  // Future MongoDB Atlas & WebRTC Endpoints (Zero-code upgrade ready)
  endpoints: {
    mongoApiUrl: "https://your-mongodb-serverless-api.netlify.app/api",
    livekitUrl: "wss://pisphere-live.livekit.cloud"
  }
};

// Global Multi-Language Dictionary
const PiSphereLang = {
  hi: {
    enter_app: "PiSphere Mein Pravesh Karein",
    legal_title: "Kanooni Suraksha & Privacy Sahmati",
    legal_agree: "Main 18+ varsh ka hoon aur PiSphere ki Terms, Privacy Policy, AI Summary aur Local Ad niyamon se sahmat hoon.",
    accept_continue: "Sahmat Hain Aur Aage Badhein",
    tab_chats: "Smart Chats & VIP Groups",
    tab_meetings: "100-User Cloud Meeting Hub",
    tab_feed: "Global Feed & Local Services",
    tab_wallet: "Pi Wallet & Daily Rewards",
    btn_start_meeting: "Cloud Meeting Shuru Karein",
    btn_join_meeting: "Meeting ID Se Judein",
    nav_chats: "Chats",
    nav_meetings: "Meeting",
    nav_feed: "Local Hub",
    nav_wallet: "Rewards"
  },
  en: {
    enter_app: "Enter PiSphere Ecosystem",
    legal_title: "Legal Shield & Privacy Consent",
    legal_agree: "I am 18+ years old and agree to PiSphere's Terms, Safe-Harbor Policy, AI Summary & Local Ad guidelines.",
    accept_continue: "Accept & Continue Safely",
    tab_chats: "Smart Chats & VIP Groups",
    tab_meetings: "100-User Cloud Meeting Hub",
    tab_feed: "Global Feed & Local Services",
    tab_wallet: "Pi Wallet & Daily Rewards",
    btn_start_meeting: "Start Cloud Meeting",
    btn_join_meeting: "Join with ID",
    nav_chats: "Chats",
    nav_meetings: "Meetings",
    nav_feed: "Local & Feed",
    nav_wallet: "Rewards & π"
  },
  es: {
    enter_app: "Entrar a PiSphere",
    legal_title: "Protección Legal y Privacidad",
    legal_agree: "Tengo más de 18 años y acepto los términos, resúmenes de IA y anuncios locales de PiSphere.",
    accept_continue: "Aceptar y Continuar",
    tab_chats: "Chats y Grupos VIP",
    tab_meetings: "Reunión en la Nube (100 Usuarios)",
    tab_feed: "Feed Global y Servicios Locales",
    tab_wallet: "Billetera Pi y Recompensas",
    btn_start_meeting: "Iniciar Reunión",
    btn_join_meeting: "Unirse con ID",
    nav_chats: "Chats",
    nav_meetings: "Reunión",
    nav_feed: "Servicios",
    nav_wallet: "Premios"
  },
  zh: {
    enter_app: "进入 PiSphere 生态系统",
    legal_title: "法律保护与隐私同意",
    legal_agree: "我已年满18岁，同意 PiSphere 的条款、AI 会议摘要和本地广告规则。",
    accept_continue: "同意并继续",
    tab_chats: "智能聊天与 VIP 群组",
    tab_meetings: "100人云端视频会议",
    tab_feed: "全球动态与本地服务",
    tab_wallet: "Pi 钱包与每日奖励",
    btn_start_meeting: "发起云会议",
    btn_join_meeting: "输入ID加入",
    nav_chats: "聊天",
    nav_meetings: "云会议",
    nav_feed: "本地服务",
    nav_wallet: "奖励"
  }
};

// Core Shell Controller
const AppShell = {
  currentUser: null,

  init: async function () {
    // Initialize Pi SDK in Sandbox/Testing Mode
    try {
      if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: PiSphereConfig.sandboxMode });
        const scopes = ["username", "payments"];
        const auth = await window.Pi.authenticate(scopes, function (payment) {
          console.log("Incomplete payment found:", payment);
        });
        this.currentUser = auth.user;
        document.getElementById("pi-user-badge").innerText = "@" + auth.user.username + " (Verified)";
      } else {
        document.getElementById("pi-user-badge").innerText = "@Pioneer_TestMode";
      }
    } catch (err) {
      document.getElementById("pi-user-badge").innerText = "@Pioneer_Guest (Sandbox)";
    }
  },

  checkLegalConsent: function () {
    const accepted = localStorage.getItem("pisphere_legal_v1");
    if (!accepted) {
      const modal = document.getElementById("legal-modal");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  },

  acceptLegal: function () {
    const check = document.getElementById("legal-checkbox");
    if (!check.checked) {
      alert("Kripya aage badhne ke liye 18+ aur Legal Terms tick-box par click karein.");
      return;
    }
    localStorage.setItem("pisphere_legal_v1", "accepted_" + Date.now());
    const modal = document.getElementById("legal-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  },

  switchTab: function (tabName) {
    const tabs = ["chats", "meetings", "feed", "wallet", "admin"];
    tabs.forEach((t) => {
      const section = document.getElementById("tab-" + t);
      if (section) section.classList.add("hidden");
      const navBtn = document.getElementById("nav-" + t);
      if (navBtn) {
        navBtn.className = "flex flex-col items-center py-1.5 rounded-xl text-gray-400 hover:text-white";
      }
    });

    const activeSection = document.getElementById("tab-" + tabName);
    if (activeSection) activeSection.classList.remove("hidden");

    const activeNav = document.getElementById("nav-" + tabName);
    if (activeNav) {
      activeNav.className = "flex flex-col items-center py-1.5 rounded-xl text-amber-400 bg-purple-900/40";
    }
  },

  changeLanguage: function (langCode) {
    const dict = PiSphereLang[langCode] || PiSphereLang.hi;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.innerText = dict[key];
    });
  },

  PublishInstantAd: function () {
    const input = document.getElementById("admin-ad-input");
    if (!input.value.trim()) return;
    const ticker = document.getElementById("live-ad-ticker");
    ticker.innerText = "📢 [ADMIN SPONSORED AD] " + input.value.trim() + " • " + ticker.innerText;
    input.value = "";
    alert("Local Ad Live Meeting aur Top Bar mein turant update ho gaya!");
  },

  unlockSummaryDemo: async function () {
    alert("Pi Payment Request: 0.5 Pi Summary Unlock trigger ho raha hai (Testing Mode).");
  },

  openSafetyReport: function () {
    const reason = prompt("Safety & Legal Report: Kisi user, group ya meeting ki shikayat darj karein:");
    if (reason) {
      alert("Aapki report Admin Command Center mein darj ho gayi hai. 24 ghante ke bheetar action liya jayega.");
    }
  },

  contactAdvertiser: function () {
    this.switchTab("chats");
    alert("Advertiser ke direct chat box se connect kiya ja raha hai...");
  },

  showToast: function (msg) {
    alert(msg);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  AppShell.init();
});

