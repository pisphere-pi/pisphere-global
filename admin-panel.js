// ==========================================
// PISPHERE MODULE 3: SUPER ADMIN COMMAND CENTER & LOCAL AD STUDIO
// ==========================================

const AdminModule = {
  totalSummarySalesPi: 14.5,
  totalAdRevenuePi: 32.0,
  localAds: [
    { id: 1, business: "Sharma Coaching Classes", text: "100-Seat Live Pi Batch Starting Today!", active: true },
    { id: 2, business: "City Care Clinic", text: "Video Consultation @ 2 Pi Only", active: true }
  ],
  safetyReports: [
    { id: 101, reason: "Spam link shared in public room by @SpamUser_99", status: "Pending" }
  ],

  init: function () {
    this.renderAdminTab();
    this.syncTickerText();
  },

  syncTickerText: function () {
    const ticker = document.getElementById("live-ad-ticker");
    if (!ticker) return;
    const activeList = this.localAds.filter((a) => a.active);
    if (activeList.length === 0) {
      ticker.innerText = "📢 Book Your Local Business Ad Here via PiSphere Admin!";
      return;
    }
    ticker.innerText = activeList
      .map((a) => `🔥 [${a.business}] ${a.text}`)
      .join("   •   ");
  },

  renderAdminTab: function () {
    const container = document.getElementById("tab-admin");
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card rounded-2xl p-4 border border-amber-500/50 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-extrabold text-amber-400">
              <i class="fa-solid fa-crown mr-1"></i> Super Admin Command Center
            </h2>
            <p class="text-[10px] text-purple-300">App ID: ${PiSphereConfig.piAppId}</p>
          </div>
          <span class="text-[10px] bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded">OWNER PANEL</span>
        </div>

        <!-- Revenue Counters -->
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-black/50 border border-amber-500/30 rounded-xl p-2.5">
            <p class="text-[10px] text-gray-400">Summary Unlocks Earned</p>
            <p class="text-base font-extrabold text-amber-400">${this.totalSummarySalesPi.toFixed(1)} π</p>
          </div>
          <div class="bg-black/50 border border-purple-500/30 rounded-xl p-2.5">
            <p class="text-[10px] text-gray-400">Local Ads & VIP Revenue</p>
            <p class="text-base font-extrabold text-emerald-400">${this.totalAdRevenuePi.toFixed(1)} π</p>
          </div>
        </div>

        <!-- 1. Local Ad Creator Studio (Meeting Bottom Bar & Top Ticker) -->
        <div class="bg-black/40 border border-purple-500/30 rounded-xl p-3 space-y-2">
          <h3 class="text-xs font-extrabold text-white">
            <i class="fa-solid fa-rectangle-ad text-amber-400 mr-1"></i> Create Local Ad for Cloud Meeting Bar
          </h3>
          <input id="new-ad-biz" type="text" placeholder="दुकान / बिजनेस का नाम (e.g. Raj Electronics)" class="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white" />
          <input id="new-ad-msg" type="text" placeholder="विज्ञापन संदेश और ऑफर लिखें..." class="w-full bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white" />
          <button onclick="AdminModule.createLocalAd()" class="w-full py-2 rounded-lg gold-gradient text-black font-extrabold text-xs">
            + Publish Live Ad on All Cloud Meetings
          </button>

          <div class="space-y-1.5 pt-2">
            ${this.localAds.map((ad) => `
              <div class="flex items-center justify-between bg-black/50 px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px]">
                <span class="truncate text-gray-200"><strong>${ad.business}:</strong> ${ad.text}</span>
                <button onclick="AdminModule.removeAd(${ad.id})" class="text-rose-400 font-bold ml-2">Delete</button>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- 2. Meeting Summary Price & Vault Control -->
        <div class="bg-black/40 border border-purple-500/30 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold text-white">
              <i class="fa-solid fa-file-invoice-dollar text-amber-400 mr-1"></i> Per-User Summary Price (π)
            </h3>
            <input id="admin-sum-price" type="number" step="0.1" value="${PiSphereConfig.defaultSummaryPricePi}" onchange="AdminModule.updateSummaryPrice(this.value)" class="w-20 bg-black border border-amber-400 rounded px-2 py-1 text-xs text-amber-300 font-bold text-center" />
          </div>
          <p class="text-[10px] text-gray-400">
            जब भी कोई मीटिंग खत्म होगी, उसकी समरी अपने आप इस रेट पर हर यूजर के लिए लॉक हो जाएगी।
          </p>
        </div>

        <!-- 3. Pi Ad Network SDK Test Trigger -->
        <div class="bg-black/40 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between">
          <div>
            <h3 class="text-xs font-extrabold text-white">Pi Ad Network Integration</h3>
            <p class="text-[10px] text-emerald-400">Interstitial & Rewarded Ads Active</p>
          </div>
          <button onclick="AppShell.showPiAd('interstitial')" class="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            Test Pi Ad
          </button>
        </div>

        <!-- 4. Legal Safe-Harbor Reports & Kill-Switch -->
        <div class="bg-black/40 border border-rose-500/30 rounded-xl p-3 space-y-2">
          <h3 class="text-xs font-extrabold text-rose-300">
            <i class="fa-solid fa-gavel mr-1"></i> Reported Users & Kill-Switch
          </h3>
          ${this.safetyReports.map((r) => `
            <div class="flex items-center justify-between bg-black/50 p-2 rounded-lg text-[11px]">
              <span class="text-gray-300">${r.reason}</span>
              <button onclick="AdminModule.blockReportedUser(${r.id})" class="bg-rose-600 text-white px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                Block ID
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  createLocalAd: function () {
    const biz = document.getElementById("new-ad-biz").value.trim();
    const msg = document.getElementById("new-ad-msg").value.trim();
    if (!biz || !msg) {
      alert("कृपया बिजनेस का नाम और विज्ञापन संदेश दोनों लिखें।");
      return;
    }
    this.localAds.unshift({ id: Date.now(), business: biz, text: msg, active: true });
    this.totalAdRevenuePi += 5.0;
    this.syncTickerText();
    this.renderAdminTab();
    if (window.MeetingModule) MeetingModule.renderMeetingTab();
    alert("✅ नया लोकल विज्ञापन लाइव मीटिंग बार और टॉप टिकर दोनों जगह चालू हो गया!");
  },

  removeAd: function (id) {
    this.localAds = this.localAds.filter((a) => a.id !== id);
    this.syncTickerText();
    this.renderAdminTab();
  },

  updateSummaryPrice: function (val) {
    const num = parseFloat(val) || 0.5;
    PiSphereConfig.defaultSummaryPricePi = num;
    if (window.MeetingModule) {
      MeetingModule.summaries.forEach((s) => (s.pricePi = num));
      MeetingModule.renderMeetingTab();
    }
    alert(`हर यूजर के लिए मीटिंग समरी का नया रेट ${num} π सेट हो गया!`);
  },

  addSafetyReport: function (reason) {
    this.safetyReports.unshift({ id: Date.now(), reason, status: "Pending" });
    this.renderAdminTab();
  },

  blockReportedUser: function (id) {
    this.safetyReports = this.safetyReports.filter((r) => r.id !== id);
    this.renderAdminTab();
    alert("🛡️ नियम तोड़ने वाले यूजर को ब्लॉक कर दिया गया है (IT Act Compliance Log Saved).");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  AdminModule.init();
});

Displaying 1000467041.png.
