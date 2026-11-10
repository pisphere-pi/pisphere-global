import React, { useState } from "react";
import { payWithPiSDK, triggerPiAd } from "../lib/piConfig";

export default function ChatModule({ mode, currentUser, rewardPoints, addPoints, onSwitchToMeeting, onReport, t }) {
  const [activeGroupId, setActiveGroupId] = useState("global_pioneers");
  const [chatInput, setChatInput] = useState("");

  const [groups, setGroups] = useState([
    { id: "global_pioneers", name: "🌐 Global Pioneers Hub", members: 1420, isVip: false, pricePi: 0, unlocked: true },
    { id: "local_biz_hub", name: "🏪 Local Business & Services Network", members: 540, isVip: false, pricePi: 0, unlocked: true },
    { id: "vip_masterclass", name: "👑 VIP Web3 & Cloud Masterclass", members: 98, isVip: true, pricePi: 1.0, unlocked: false }
  ]);

  const [messages, setMessages] = useState({
    global_pioneers: [
      { sender: "@Rahul_Pi", text: "नमस्ते पायनियर्स! आज रात 8 बजे 100 लोगों की क्लाउड मीटिंग है।", time: "10:15 AM" },
      { sender: "@Tiya_Web3", text: "मीटिंग खत्म होते ही उसकी AI समरी 0.5 Pi में डाउनलोड हो जाएगी!", time: "10:17 AM" }
    ],
    local_biz_hub: [
      { sender: "@Dr_Verma_Clinic", text: "हमारे क्लिनिक पर अब Pi कॉइन से वीडियो परामर्श उपलब्ध है।", time: "09:40 AM" }
    ],
    vip_masterclass: [
      { sender: "@Admin_PiSphere", text: "VIP ग्रुप में आपका स्वागत है!", time: "11:00 AM" }
    ]
  });

  const [feedPosts, setFeedPosts] = useState([
    {
      id: 1,
      author: "@Sharma_Coaching",
      category: "Education • Live Batch",
      text: "🎓 नया 100-सीट लाइव क्लाउड बैच शुरू! PiSphere मीटिंग रूम के जरिए घर बैठे पढ़ें। फीस: केवल 3 Pi/माह।",
      likes: 42,
      pricePi: 3.0
    },
    {
      id: 2,
      author: "@City_Care_Health",
      category: "Healthcare • Video Consult",
      text: "🏥 डॉक्टर से सीधे 1-ऑन-1 क्लाउड वीडियो परामर्श लें और प्रिसक्रिप्शन समरी डाउनलोड करें।",
      likes: 29,
      pricePi: 2.0
    }
  ]);

  const handleSelectGroup = (g) => {
    if (g.isVip && !g.unlocked) {
      payWithPiSDK(g.pricePi, `Unlock VIP Group: ${g.name}`, { groupId: g.id }, currentUser.username, () => {
        setGroups(groups.map((item) => (item.id === g.id ? { ...item, unlocked: true } : item)));
        setActiveGroupId(g.id);
      });
      return;
    }
    setActiveGroupId(g.id);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: "@" + (currentUser.username || "Pioneer"),
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages({ ...messages, [activeGroupId]: [...(messages[activeGroupId] || []), newMsg] });
    setChatInput("");
  };

  const handleCreateGroup = () => {
    const name = prompt("Group / Channel Name:");
    if (!name) return;
    const price = parseFloat(prompt("VIP Entry Fee in Pi (0 for Free):", "0")) || 0;
    const newId = "grp_" + Date.now();
    setGroups([
      ...groups,
      { id: newId, name: (price > 0 ? "👑 " : "💬 ") + name.trim(), members: 1, isVip: price > 0, pricePi: price, unlocked: true }
    ]);
    setMessages({ ...messages, [newId]: [{ sender: "@System", text: `Group '${name}' created!`, time: "Now" }] });
    setActiveGroupId(newId);
  };

  if (mode === "chats") {
    const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
    const currentMsgs = messages[activeGroupId] || [];

    return (
      <div className="space-y-3">
        <div className="glass-card rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#e2be5a]">
              <i className="fa-solid fa-users mr-1.5" /> {t("chats_heading")}
            </h2>
            <button onClick={handleCreateGroup} className="text-[11px] soft-gold-btn px-3 py-1 rounded-xl font-extrabold">
              {t("new_group_btn")}
            </button>
          </div>

          <div className="space-y-2">
            {groups.map((g) => (
              <div
                key={g.id}
                onClick={() => handleSelectGroup(g)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                  g.id === activeGroupId ? "bg-purple-900/60 border border-[#e2be5a]/50" : "bg-black/35 hover:bg-white/5"
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{g.name}</span>
                    {g.isVip && (
                      <span className="text-[9px] soft-gold-btn px-1.5 py-0.5 rounded font-extrabold">
                        {g.pricePi} π VIP
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-purple-300 mt-0.5">
                    {g.members} {t("pioneers_encrypted")}
                  </p>
                </div>
                <span className="text-[10px] bg-purple-950 text-[#f3d98b] px-2.5 py-1 rounded-full font-bold border border-purple-500/30">
                  {g.unlocked ? t("open_badge") : t("locked_badge")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3.5 flex flex-col h-80">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
            <div>
              <h3 className="text-xs font-extrabold text-white">{activeGroup.name}</h3>
              <p className="text-[10px] text-emerald-400">● {activeGroup.members} {t("online_safe")}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={onSwitchToMeeting} className="soft-gold-btn text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                <i className="fa-solid fa-video mr-1" /> {t("live_meet_btn")}
              </button>
              <button onClick={onReport} className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-1 rounded-lg border border-rose-500/30">
                {t("report_btn")}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-1">
            {currentMsgs.map((m, idx) => (
              <div key={idx} className="bg-black/45 border border-purple-500/20 rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[10px] text-[#e2be5a] font-bold mb-1">
                  <span>{m.sender}</span>
                  <span className="text-gray-400">{m.time}</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              type="text"
              placeholder={t("chat_placeholder")}
              className="flex-1 bg-black/55 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
            <button onClick={handleSendMessage} className="soft-gold-btn px-3.5 py-2 rounded-xl text-xs font-extrabold">
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "feed") {
    const handlePostOffer = () => {
      const text = prompt("Write your Local Service Offer or Social Post:");
      if (!text) return;
      const price = parseFloat(prompt("Booking Fee in Pi:", "1.5")) || 1.5;
      setFeedPosts([
        {
          id: Date.now(),
          author: "@" + (currentUser.username || "Pioneer_Biz"),
          category: "Verified Local Service",
          text: text.trim(),
          likes: 1,
          pricePi: price
        },
        ...feedPosts
      ]);
    };

    return (
      <div className="glass-card rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white">
            <i className="fa-solid fa-earth-asia text-[#e2be5a] mr-1.5" /> {t("feed_heading")}
          </h2>
          <button onClick={handlePostOffer} className="text-xs soft-gold-btn px-3 py-1.5 rounded-xl font-extrabold">
            {t("post_offer_btn")}
          </button>
        </div>

        <div className="space-y-2.5">
          {feedPosts.map((post) => (
            <div key={post.id} className="bg-black/45 border border-purple-500/30 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white flex items-center gap-1">
                  {post.author} <i className="fa-solid fa-circle-check text-sky-400 text-xs" />
                </span>
                <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded">{post.category}</span>
              </div>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed">{post.text}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                <button
                  onClick={() =>
                    setFeedPosts(feedPosts.map((p) => (p.id === post.id ? { ...p, likes: p.likes + 1 } : p)))
                  }
                  className="text-xs text-pink-400 font-bold"
                >
                  <i className="fa-solid fa-heart mr-1" /> {post.likes}
                </button>
                <button
                  onClick={() =>
                    payWithPiSDK(post.pricePi, `Book Service: ${post.author}`, { postId: post.id }, currentUser.username)
                  }
                  className="soft-gold-btn text-xs px-3.5 py-1.5 rounded-xl font-extrabold"
                >
                  {t("book_service_btn")} ({post.pricePi} π)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-purple-300">{t("wallet_subtitle")}</p>
          <h2 className="text-2xl font-extrabold text-[#e2be5a]">{rewardPoints} PTS</h2>
        </div>
        <button
          onClick={() => triggerPiAd("rewarded", () => addPoints(25, "Pi Rewarded Ad"))}
          className="soft-gold-btn text-xs px-3.5 py-2.5 rounded-xl font-extrabold shadow-md"
        >
          <i className="fa-solid fa-play mr-1" /> {t("watch_ad_btn")}
        </button>
      </div>

      <div className="bg-black/45 border border-purple-500/20 rounded-xl p-3 space-y-2.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t("blue_tick_label")}</span>
          <button
            onClick={() => payWithPiSDK(3.0, "Verified Blue Tick Badge", { type: "blue_tick" }, currentUser.username)}
            className="text-[#e2be5a] font-extrabold underline"
          >
            {t("activate_btn")} @ 3.0 π
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t("gdpr_delete_label")}</span>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-rose-400 font-extrabold underline"
          >
            {t("delete_data_btn")}
          </button>
        </div>
      </div>

      <div className="pt-1">
        <p className="text-xs font-bold text-white mb-1.5">{t("recent_activity")}</p>
        <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 flex justify-between text-xs">
          <span className="text-gray-300">{t("welcome_bonus")}</span>
          <span className="text-[#e2be5a] font-extrabold">+150 PTS</span>
        </div>
      </div>
    </div>
  );
}
Displaying 1000467041.png. 
