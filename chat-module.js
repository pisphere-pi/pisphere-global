// ==========================================
// PISPHERE MODULE 1: SMART CHATS, VIP GROUPS, SOCIAL FEED & WALLET
// ==========================================

const ChatModule = {
  activeGroupId: "global_pioneers",
  groups: [
    { id: "global_pioneers", name: "🌐 Global Pioneers Hub", members: 1420, isVip: false, pricePi: 0, unread: 3 },
    { id: "bihar_local_biz", name: "🏪 Local Business & Services Network", members: 540, isVip: false, pricePi: 0, unread: 1 },
    { id: "vip_crypto_class", name: "👑 VIP Web3 & Trading Masterclass", members: 98, isVip: true, pricePi: 1.0, unlocked: false, unread: 5 }
  ],

  messages: {
    global_pioneers: [
      { sender: "@Rahul_Pi", text: "नमस्ते पायनियर्स! आज शाम 8 बजे 100 लोगों की क्लाउड मीटिंग है।", time: "10:15 AM" },
      { sender: "@Tiya_Web3", text: "क्या आज की मीटिंग की AI समरी हिंदी और इंग्लिश दोनों में मिलेगी?", time: "10:17 AM" },
      { sender: "@Admin_PiSphere", text: "बिल्कुल! मीटिंग खत्म होते ही आप 0.5 Pi में पूरी PDF समरी डाउनलोड कर सकते हैं।", time: "10:18 AM" }
    ],
    bihar_local_biz: [
      { sender: "@Dr_Verma_Clinic", text: "हमारे क्लिनिक पर अब Pi कॉइन से ऑनलाइन वीडियो परामर्श उपलब्ध है।", time: "09:40 AM" }
    ],
    vip_crypto_class: [
      { sender: "@Mentor_Pro", text: "VIP मेंबर्स का स्वागत है! आज का लाइव चार्ट नोट्स ऊपर पिन कर दिया गया है।", time: "11:00 AM" }
    ]
  },

  feedPosts: [
    {
      id: 1,
      author: "@Sharma_Coaching",
      verified: true,
      category: "Education • Local Service",
      text: "🎓 नया 100-सीट लाइव क्लाउड बैच शुरू! PiSphere मीटिंग रूम के जरिए घर बैठे पढ़ें। फीस: केवल 3 Pi/माह।",
      likes: 42,
      servicePricePi: 3.0
    },
    {
      id: 2,
      author: "@City_Care_Health",
      verified: true,
      category: "Healthcare • Video Consult",
      text: "🏥 डॉक्टर से सीधे 1-ऑन-1 क्लाउड वीडियो परामर्श लें और प्रिसक्रिप्शन समरी डाउनलोड करें।",
      likes: 29,
      servicePricePi: 2.0
    }
  ],

  init: function () {
    this.renderChatsTab();
    this.renderFeedTab();
    this.renderWalletTab();
  },

  renderChatsTab: function () {
    const container = document.getElementById("tab-chats");
    if (!container) return;

    const activeGroup = this.groups.find((g) => g.id === this.activeGroupId) || this.groups[0];
    const msgs = this.messages[this.activeGroupId] || [];

    container.innerHTML = `
      <!-- Group Selector Pills -->
      <div class="glass-card rounded-2xl p-3">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            <i class="fa-solid fa-users-viewfinder mr-1"></i> Telegram-Style Groups & Channels
          </h2>
          <button onclick="ChatModule.createNewGroup()" class="text-[11px] bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded-lg font-bold">
            + Create Group
          </button>
        </div>

        <div class="space-y-1.5">
          ${this.groups.map((g) => `
            <div onclick="ChatModule.selectGroup('${g.id}')" class="flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${g.id === this.activeGroupId ? 'bg-purple-800/70 border border-amber-400/50' : 'bg-black/30 hover:bg-white/5'}">
              <div>
                <p class="text-xs font-bold text-white flex items-center gap-1.5">
                  ${g.name}
                  ${g.isVip ? `<span class="text-[9px] bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded">${g.pricePi} π VIP</span>` : ''}
                </p>
                <p class="text-[10px] text-purple-300">${g.members} Pioneers • Encrypted</p>
              </div>
              <span class="text-[10px] bg-purple-950 text-amber-300 px-2 py-0.5 rounded-full font-bold">${g.unread} new</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Active Chat Box -->
      <div class="glass-card rounded-2xl p-3 flex flex-col h-80">
        <div class="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div>
            <h3 class="text-xs font-extrabold text-white">${activeGroup.name}</h3>
            <p class="text-[10px] text-emerald-400">● ${activeGroup.members} Online • Safe-Harbor Protected</p>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="AppShell.switchTab('meetings')" class="bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
              <i class="fa-solid fa-video mr-1"></i> Live Call
            </button>
            <button onclick="AppShell.openSafetyReport()" class="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-1 rounded-lg border border-rose-500/30">
              Report
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="chat-msg-list" class="flex-1 overflow-y-auto space-y-2 pr-1">
          ${msgs.map((m) => `
            <div class="bg-black/40 border border-purple-500/20 rounded-xl p-2.5">
              <div class="flex items-center justify-between text-[10px] text-amber-300 font-bold mb-0.5">
                <span>${m.sender}</span>
                <span class="text-gray-400">${m.time}</span>
              </div>
              <p class="text-xs text-gray-200">${m.text}</p>
            </div>
          `).join("")}
        </div>

        <!-- Chat Input -->
        <div class="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
          <input id="chat-input-box" type="text" placeholder="ग्रुप में मैसेज लिखें..." class="flex-1 bg-black/50 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" />
          <button onclick="ChatModule.sendMessage()" class="gold-gradient text-black font-extrabold px-3.5 py-2 rounded-xl text-xs">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
  },

  selectGroup: function (groupId) {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return;

    if (group.isVip && !group.unlocked) {
      AppShell.payWithPi(
        group.pricePi,
        `Unlock VIP Group: ${group.name}`,
        { type: "vip_group", groupId: group.id },
        () => {
          group.unlocked = true;
          this.activeGroupId = groupId;
          this.renderChatsTab();
          alert("🎉 VIP ग्रुप अनलॉक हो गया! (15% कमीशन एडमिन वॉलेट में गया)");
        }
      );
      return;
    }

    this.activeGroupId = groupId;
    group.unread = 0;
    this.renderChatsTab();
  },

  sendMessage: function () {
    const input = document.getElementById("chat-input-box");
    if (!input || !input.value.trim()) return;

    const list = this.messages[this.activeGroupId] || [];
    list.push({
      sender: "@" + (AppShell.currentUser.username || "Pioneer_You"),
      text: input.value.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    this.messages[this.activeGroupId] = list;
    input.value = "";
    this.renderChatsTab();
  },

  createNewGroup: function () {
    const name = prompt("नए चैट ग्रुप या VIP चैनल का नाम लिखें:");
    if (!name) return;
    const price = prompt("क्या यह पेड VIP ग्रुप है? (फ्री रखने के लिए 0 लिखें, या Pi में फीस लिखें जैसे 1.5):", "0");
    const priceNum = parseFloat(price) || 0;

    const newId = "grp_" + Date.now();
    this.groups.push({
      id: newId,
      name: (priceNum > 0 ? "👑 " : "💬 ") + name.trim(),
      members: 1,
      isVip: priceNum > 0,
      pricePi: priceNum,
      unlocked: true,
      unread: 0
    });
    this.messages[newId] = [
      { sender: "@System", text: `ग्रुप '${name}' सफलतापूर्वक बनाया गया!`, time: "Just now" }
    ];
    this.activeGroupId = newId;
    this.renderChatsTab();
  },

  renderFeedTab: function () {
    const container = document.getElementById("tab-feed");
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card rounded-2xl p-3.5">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-extrabold text-white">
            <i class="fa-solid fa-bullhorn text-amber-400 mr-1"></i> Social Feed & Local Services
          </h2>
          <button onclick="ChatModule.createFeedPost()" class="text-xs gold-gradient text-black font-extrabold px-2.5 py-1 rounded-lg">
            + Post Offer
          </button>
        </div>
        <p class="text-[11px] text-purple-300 mb-3">
          ट्विटर जैसा लाइव फीड जहाँ लोकल डॉक्टर, टीचर और दुकानदार अपनी सर्विस पोस्ट करते हैं और सीधे Pi में बुकिंग लेते हैं।
        </p>

        <div class="space-y-2.5">
          ${this.feedPosts.map((post) => `
            <div class="bg-black/40 border border-purple-500/30 rounded-xl p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-extrabold text-white">${post.author}</span>
                  ${post.verified ? `<i class="fa-solid fa-circle-check text-sky-400 text-xs" title="Verified Local Business"></i>` : ''}
                </div>
                <span class="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded">${post.category}</span>
              </div>
              <p class="text-xs text-gray-200 mt-2">${post.text}</p>
              <div class="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                <button onclick="ChatModule.likePost(${post.id})" class="text-xs text-pink-400 font-bold">
                  <i class="fa-solid fa-heart mr-1"></i> ${post.likes}
                </button>
                <button onclick="ChatModule.bookLocalService('${post.author}', ${post.servicePricePi})" class="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-3 py-1 rounded-lg">
                  Book Service (${post.servicePricePi} π)
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  },

  createFeedPost: function () {
    const text = prompt("अपना सोशल अपडेट या लोकल सर्विस ऑफर लिखें:");
    if (!text) return;
    const price = parseFloat(prompt("सर्विस बुकिंग रेट (Pi में) लिखें:", "1.0")) || 1.0;
    this.feedPosts.unshift({
      id: Date.now(),
      author: "@" + (AppShell.currentUser.username || "Pioneer_Biz"),
      verified: true,
      category: "Local Service",
      text: text.trim(),
      likes: 1,
      servicePricePi: price
    });
    this.renderFeedTab();
  },

  likePost: function (id) {
    const p = this.feedPosts.find((x) => x.id === id);
    if (p) p.likes++;
    this.renderFeedTab();
  },

  bookLocalService: function (provider, pricePi) {
    AppShell.payWithPi(
      pricePi,
      `Local Service Booking: ${provider}`,
      { type: "local_service", provider },
      () => {
        alert(`✅ ${provider} के साथ आपकी सर्विस बुक हो गई! (एडमिन कमीशन: 15%)`);
      }
    );
  },

  renderWalletTab: function () {
    const container = document.getElementById("tab-wallet");
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] text-purple-300">PiSphere Reward Balance</p>
            <h2 class="text-2xl font-extrabold text-amber-400">${AppShell.rewardPoints} PTS</h2>
          </div>
          <button onclick="AppShell.showPiAd('rewarded', () => AppShell.addRewardPoints(25, 'Watched Pi Rewarded Ad'))" class="gold-gradient text-black font-extrabold text-xs px-3 py-2 rounded-xl shadow-lg">
            <i class="fa-solid fa-play mr-1"></i> Watch Pi Ad (+25 PTS)
          </button>
        </div>

        <div class="bg-black/40 border border-purple-500/20 rounded-xl p-3 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-300">Verified Blue-Tick Badge (Monthly)</span>
            <button onclick="AppShell.payWithPi(3.0, 'Verified Blue Tick Subscription', {type:'blue_tick'}, () => alert('Blue Tick Activated!'))" class="text-amber-400 font-bold underline">Get @ 3.0 π</button>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Delete My Account Data (GDPR Right)</span>
            <button onclick="localStorage.clear(); alert('आपका लोकल कैश और डेटा डिलीट कर दिया गया।'); location.reload();" class="text-rose-400 font-bold underline">Reset Data</button>
          </div>
        </div>
      </div>
    `;
  }
};

window.addEventListener("DOMContentLoaded", () => {
  ChatModule.init();
});

Displaying 1000467041.png.
