// ==========================================
// PISPHERE MODULE 2: 100-USER CLOUD MEETING & PAID AI SUMMARY ENGINE
// ==========================================

const MeetingModule = {
  isLive: false,
  lowDataAudioOnly: false,
  participantCount: 86,
  roomCode: "PI-GLOBAL-100",

  summaries: [
    {
      id: "sum_101",
      title: "PiSphere Web3 Global Launch & Business Meet",
      date: "Today • 86 Participants",
      host: "@Admin_PiSphere",
      pricePi: 0.5,
      unlockedByMe: false,
      preview: "1. लोकल दुकानदारों को क्लाउड मीटिंग बार में विज्ञापन देने का सिस्टम लाइव हुआ...",
      fullContent: `=== PISPHERE OFFICIAL AI MEETING SUMMARY (MOM) ===
Meeting ID: PI-GLOBAL-100 | Attendance: 86/100 Pioneers

1. मुख्य निर्णय: सभी लोकल कोचिंग, डॉक्टर और दुकानदार अपनी सर्विस को 1 क्लिक में प्रमोट कर सकेंगे।
2. क्लाउड मीटिंग नियम: 30 मिनट तक बेसिक कॉल फ्री रहेगी; 100 लोगों के अनलिमिटेड सेशन के लिए 2 Pi होस्ट पास लगेगा।
3. रेवेन्यू मॉडल: मीटिंग में शामिल हर सदस्य ज़रूरत के हिसाब से 0.5 Pi देकर यह पूरी समरी अपने फोन में डाउनलोड कर सकता है।
4. कानूनी सुरक्षा: सभी यूजर्स के लिए रिपोर्ट और ब्लॉक बटन सक्रिय है।`
    }
  ],

  init: function () {
    this.renderMeetingTab();
  },

  renderMeetingTab: function () {
    const container = document.getElementById("tab-meetings");
    if (!container) return;

    container.innerHTML = `
      <!-- Cloud Meeting Control Card -->
      <div class="glass-card rounded-2xl p-3.5">
        <div class="flex items-center justify-between mb-2">
          <div>
            <h2 class="text-sm font-extrabold text-white">100-User Cloud Meeting Room</h2>
            <p class="text-[11px] text-purple-300">Room ID: <strong class="text-amber-300">${this.roomCode}</strong> • Active Speaker Engine</p>
          </div>
          <span class="text-[10px] ${this.isLive ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'} px-2 py-0.5 rounded-full font-bold">
            ${this.isLive ? '● LIVE (' + this.participantCount + '/100)' : 'READY'}
          </span>
        </div>

        ${!this.isLive ? `
          <div class="grid grid-cols-2 gap-2 mt-3">
            <button onclick="MeetingModule.startMeeting()" class="p-3 rounded-xl gold-gradient text-black font-extrabold text-xs flex flex-col items-center gap-1 shadow-lg">
              <i class="fa-solid fa-video text-base"></i>
              <span>Start 100-User Meet</span>
            </button>
            <button onclick="MeetingModule.buyUnlimitedHostPass()" class="p-3 rounded-xl bg-purple-900/70 border border-amber-400/40 text-amber-300 font-extrabold text-xs flex flex-col items-center gap-1">
              <i class="fa-solid fa-crown text-base"></i>
              <span>Pro Host Pass (2 π)</span>
            </button>
          </div>
        ` : `
          <!-- Active 100-User Smart Grid View -->
          <div class="mt-2 bg-[#06040c] border border-purple-500/40 rounded-xl p-2.5 space-y-2">
            <div class="flex items-center justify-between text-[10px] text-gray-300">
              <span>🎙️ Active Speakers (4 Front + ${this.participantCount - 4} in Grid)</span>
              <button onclick="MeetingModule.toggleLowData()" class="px-2 py-0.5 rounded bg-purple-800 text-amber-300 font-bold">
                ${this.lowDataAudioOnly ? '⚡ Audio-Only (Low Data)' : '📹 HD Video Mode'}
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2">
              ${["@Host_Ranjeeth", "@Dr_Verma", "@Tiya_Web3", "@Sharma_Sir"].map((sp, idx) => `
                <div class="h-24 rounded-lg bg-gradient-to-br from-purple-950 to-black border ${idx === 0 ? 'border-amber-400' : 'border-purple-500/30'} flex flex-col items-center justify-center relative">
                  <div class="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-black font-extrabold text-xs">
                    ${sp.slice(1, 3).toUpperCase()}
                  </div>
                  <span class="text-[10px] text-white font-bold mt-1">${sp}</span>
                  <span class="text-[9px] text-emerald-400">${this.lowDataAudioOnly ? '🔊 Voice Active' : '🎥 HD Stream'}</span>
                </div>
              `).join("")}
            </div>

            <!-- Embedded Live Local Ad Bar inside Meeting Screen -->
            <div class="bg-amber-500/20 border border-amber-400/50 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <span class="text-[10px] text-amber-200 truncate">
                📢 <strong>Meeting Ad:</strong> ${document.getElementById('live-ad-ticker') ? document.getElementById('live-ad-ticker').innerText : 'Local Business Ads Active'}
              </span>
              <span class="text-[9px] bg-amber-400 text-black font-extrabold px-1.5 py-0.5 rounded ml-1">LIVE AD</span>
            </div>

            <div class="flex items-center justify-between gap-2 pt-1">
              <button onclick="MeetingModule.endAndGenerateSummary()" class="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs">
                End & Generate AI Summary
              </button>
            </div>
          </div>
        `}
      </div>

      <!-- Paid AI Meeting Summary Vault (Per-User Unlock) -->
      <div class="glass-card rounded-2xl p-3.5 space-y-2.5">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
            <i class="fa-solid fa-file-shield mr-1"></i> AI Meeting Summaries (Pay-Per-User)
          </h3>
          <span class="text-[10px] text-purple-300">${PiSphereConfig.defaultSummaryPricePi} π / Download</span>
        </div>

        ${this.summaries.map((s) => `
          <div class="bg-black/45 border border-amber-500/30 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-extrabold text-white">${s.title}</h4>
                <p class="text-[10px] text-purple-300">${s.date} • Host: ${s.host}</p>
              </div>
              <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                ${s.unlockedByMe ? 'UNLOCKED' : s.pricePi + ' π'}
              </span>
            </div>

            ${!s.unlockedByMe ? `
              <p class="text-xs text-gray-300">${s.preview} <span class="text-amber-400 font-bold">[Locked]</span></p>
              <button onclick="MeetingModule.unlockSummary('${s.id}')" class="w-full py-2 rounded-lg gold-gradient text-black font-extrabold text-xs flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-lock-open"></i> Pay ${s.pricePi} π to Read & Download Summary
              </button>
            ` : `
              <pre class="text-[11px] text-emerald-200 bg-black/60 p-2.5 rounded-lg whitespace-pre-wrap font-sans border border-emerald-500/30">${s.fullContent}</pre>
              <button onclick="MeetingModule.downloadSummaryFile('${s.id}')" class="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs">
                <i class="fa-solid fa-download mr-1"></i> Download Official Summary (.TXT / Print)
              </button>
            `}
          </div>
        `).join("")}
      </div>
    `;
  },

  startMeeting: function () {
    this.isLive = true;
    this.renderMeetingTab();
  },

  toggleLowData: function () {
    this.lowDataAudioOnly = !this.lowDataAudioOnly;
    this.renderMeetingTab();
  },

  buyUnlimitedHostPass: function () {
    AppShell.payWithPi(
      PiSphereConfig.defaultMeetingPassPi,
      "100-User Unlimited Cloud Meeting Host Pass",
      { type: "host_pass" },
      () => {
        alert("🎉 Pro Host Pass एक्टिवेट हो गया! अब आप बिना समय सीमा के 100 लोगों की मीटिंग और रिकॉर्डिंग चला सकते हैं।");
      }
    );
  },

  endAndGenerateSummary: function () {
    this.isLive = false;
    const customTopic = prompt("मीटिंग खत्म हुई! इस मीटिंग का मुख्य विषय (Topic) लिखें ताकि AI समरी एडमिन वॉल्ट में सेव हो जाए:", "PiSphere Business & Local Ad Strategy Meet");
    if (customTopic) {
      const newSum = {
        id: "sum_" + Date.now(),
        title: customTopic.trim(),
        date: "Just Now • " + this.participantCount + " Participants",
        host: "@" + (AppShell.currentUser.username || "Host_Pioneer"),
        pricePi: PiSphereConfig.defaultSummaryPricePi,
        unlockedByMe: false,
        preview: `मीटिंग '${customTopic}' के मुख्य बिंदु और फैसले तैयार हो चुके हैं...`,
        fullContent: `=== PISPHERE AI MEETING SUMMARY ===\nTopic: ${customTopic}\nParticipants: ${this.participantCount}\n\n1. मीटिंग के सभी मुख्य विचार और एक्शन पॉइंट्स रिकॉर्ड किए गए।\n2. लोकल सर्विस और ग्रुप टास्क अगले सप्ताह तक पूरे किए जाएंगे।\n3. Verified by PiSphere Admin Vault.`
      };
      this.summaries.unshift(newSum);
      if (window.AdminModule) AdminModule.renderAdminTab();
    }
    // मीटिंग खत्म होने पर फ्री यूजर्स को Pi Interstitial Ad दिखाएं
    AppShell.showPiAd("interstitial");
    this.renderMeetingTab();
  },

  unlockSummary: function (sumId) {
    const item = this.summaries.find((s) => s.id === sumId);
    if (!item) return;

    AppShell.payWithPi(
      item.pricePi,
      `Unlock Meeting Summary: ${item.title}`,
      { type: "meeting_summary", summaryId: item.id },
      () => {
        item.unlockedByMe = true;
        if (window.AdminModule) AdminModule.totalSummarySalesPi += item.pricePi;
        this.renderMeetingTab();
        if (window.AdminModule) AdminModule.renderAdminTab();
      }
    );
  },

  downloadSummaryFile: function (sumId) {
    const item = this.summaries.find((s) => s.id === sumId);
    if (!item) return;
    const blob = new Blob([item.fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.replace(/\s+/g, "_")}_Summary.txt`;
    a.click();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  MeetingModule.init();
});

Displaying 1000467041.png.
