// ==========================================
// PISPHERE GLOBAL CONFIGURATION, PI SDK & PI ADS ENGINE
// © 2026 PiSphere Official. All Rights Reserved.
// ==========================================

const PiSphereConfig = {
  appName: "PiSphere",
  // नीचे अपनी Pi Developer Portal / App Studio वाली App ID डालें:
  piAppId: "pisphere-global-app-id",
  validationFileUrl: "/pi-app-validation.txt",
  version: "1.0.0",
  sandboxMode: true, // टेस्टिंग के लिए true है, मेननेट या लाइव पर false कर सकते हैं
  adNetworkEnabled: true,
  defaultSummaryPricePi: 0.5,
  defaultMeetingPassPi: 2.0,
  vipGroupEntryPi: 1.0,
  platformCommissionPercent: 15,
  endpoints: {
    // अगर आप Pi App Studio का बैकएंड इस्तेमाल कर रहे हैं तो उसका लिंक यहाँ रहेगा:
    piAuthLoginUrl: "https://backend.appstudio.piappengine.com/pi/auth/v1/login",
    mongoApiUrl: "https://your-mongodb-serverless-api.netlify.app/api",
    livekitUrl: "wss://pisphere-live.livekit.cloud"
  }
};

const PiSphereLang = {
  hi: {
    enter_app: "PiSphere में प्रवेश करें",
    legal_title: "कानूनी सुरक्षा और प्राइवेसी सहमति",
    legal_agree: "मैं 18+ वर्ष का हूँ और PiSphere की शर्तों, प्राइवेसी पॉलिसी, AI मीटिंग समरी और लोकल विज्ञापन नियमों से सहमत हूँ।",
    accept_continue: "सहमत हैं और आगे बढ़ें",
    nav_chats: "चैट्स",
    nav_meetings: "मीटिंग",
    nav_feed: "लोकल हब",
    nav_wallet: "रिवॉर्ड्स"
  },
  en: {
    enter_app: "Enter PiSphere Ecosystem",
    legal_title: "Legal Shield & Privacy Consent",
    legal_agree: "I am 18+ years old and agree to PiSphere's Terms, Safe-Harbor Policy, AI Summary & Local Ad guidelines.",
    accept_continue: "Accept & Continue Safely",
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
    nav_chats: "聊天",
    nav_meetings: "云会议",
    nav_feed: "本地服务",
    nav_wallet: "奖励"
  }
};

const AppShell = {
  currentUser: { username: "Pioneer_Guest", uid: "test_uid_01" },
  rewardPoints: Number(localStorage.getItem("pisphere_pts") || 120),

  init: async function () {
    try {
      if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: PiSphereConfig.sandboxMode });
        const scopes = ["username", "payments"];
        const auth = await window.Pi.authenticate(scopes, function (incompletePayment) {
          console.log("Incomplete Pi Payment:", incompletePayment);
        });
        this.currentUser = auth.user;
        document.getElementById("pi-user-badge").innerText = "@" + auth.user.username + " • Verified";
      } else {
        document.getElementById("pi-user-badge").innerText = "@Pioneer_TestMode (Sandbox)";
      }
    } catch (err) {
      document.getElementById("pi-user-badge").innerText = "@Pioneer_Sandbox";
    }
  },

  // ऑफिशियल Pi Payment फंक्शन (मीटिंग समरी, VIP ग्रुप, लोकल सर्विस व पास के लिए)
  payWithPi: async function (amountPi, memoText, metadataObj, onSuccessCallback) {
    if (!window.Pi) {
      const confirmSim = confirm(`[Pi Sandbox Payment]\n\nService: ${memoText}\nAmount: ${amountPi} π\n\nक्या आप टेस्ट पेमेंट अप्रूव करना चाहते हैं?`);
      if (confirmSim && onSuccessCallback) onSuccessCallback({ txid: "sandbox_tx_" + Date.now() });
      return;
    }

    try {
      await window.Pi.createPayment(
        {
          amount: Number(amountPi),
          memo: memoText,
          metadata: Object.assign({ appId: PiSphereConfig.piAppId }, metadataObj || {})
        },
        {
          onReadyForServerApproval: function (paymentId) {
            console.log("Server approval requested for:", paymentId);
          },
          onReadyForServerCompletion: function (paymentId, txid) {
            if (onSuccessCallback) onSuccessCallback({ paymentId, txid });
          },
          onCancel: function (paymentId) {
            alert("पेमेंट कैंसिल कर दिया गया।");
          },
          onError: function (error, payment) {
            console.warn("Pi SDK Payment Fallback for testing:", error);
            const ok = confirm(`[Testing Mode Payment]\n${memoText} (${amountPi} π) को टेस्ट मोड में अनलॉक करें?`);
            if (ok && onSuccessCallback) onSuccessCallback({ txid: "test_tx_" + Date.now() });
          }
        }
      );
    } catch (e) {
      const ok = confirm(`[Testing Mode Payment]\n${memoText} (${amountPi} π) को टेस्ट मोड में अनलॉक करें?`);
      if (ok && onSuccessCallback) onSuccessCallback({ txid: "test_tx_" + Date.now() });
    }
  },

  // ऑफिशियल Pi Ad Network (Interstitial & Rewarded Ads)
  showPiAd: async function (adType = "interstitial", onRewardCallback) {
    try {
      if (window.Pi && window.Pi.Ads) {
        const isReady = await window.Pi.Ads.isAdReady(adType);
        if (!isReady.ready) {
          await window.Pi.Ads.requestAd(adType);
        }
        const response = await window.Pi.Ads.showAd(adType);
        if (response.result === "AD_REWARDED" || response.result === "AD_CLOSED") {
          if (onRewardCallback) onRewardCallback();
        }
        return;
      }
    } catch (err) {
      console.log("Pi Ads SDK fallback in browser:", err);
    }

    // ब्राउज़र/टेस्टिंग मोड में Pi Ad सिमुलेशन
    alert(`📺 [Pi Ad Network — ${adType.toUpperCase()} AD]\n\nPi Ecosystem Sponsored Ad दिखाया गया! (आपकी App ID पर रेवेन्यू काउंट हुआ)`);
    if (onRewardCallback) onRewardCallback();
  },

  addRewardPoints: function (pts, reason) {
    this.rewardPoints += pts;
    localStorage.setItem("pisphere_pts", this.rewardPoints);
    if (window.ChatModule) ChatModule.renderWalletTab();
    if (reason) alert(`🎉 +${pts} PiSphere Points मिले! (${reason})`);
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
      alert("कृपया आगे बढ़ने के लिए 18+ और कानूनी शर्तों वाले बॉक्स पर टिक करें।");
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

  openSafetyReport: function () {
    const reason = prompt("🛡️ Safety & Legal Report (IT Act Sec 79):\nकिसी यूजर, ग्रुप या मीटिंग की शिकायत यहाँ लिखें:");
    if (reason && reason.trim()) {
      if (window.AdminModule) {
        AdminModule.addSafetyReport(reason.trim());
      }
      alert("आपकी शिकायत एडमिन कमांड सेंटर में दर्ज हो गई है। 24 घंटे के भीतर कार्रवाई की जाएगी।");
    }
  },

  contactAdvertiser: function () {
    this.switchTab("chats");
    alert("लोकल विज्ञापनदाता के चैट बॉक्स से जोड़ा जा रहा है...");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  AppShell.init();
});

Displaying 1000467041.png.
