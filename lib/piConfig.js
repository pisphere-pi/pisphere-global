// ==========================================
// PISPHERE NEXT.JS CONFIG, 42-LANGUAGE ENGINE, PI SDK & SECRET ADMIN AUTH
// Copyright (c) 2026 PiSphere Global. All Rights Reserved.
// ==========================================

export const PiSphereConfig = {
  appName: "PiSphere",
  piAppId: "pisphere-global-app-id", // अपनी Pi Developer Portal App ID यहाँ डालें
  ownerUsername: "Ranjeeth_Pi",      // आपका Pi Username जिस पर एडमिन पैनल अपने आप खुलेगा
  ownerSecretKey: "Ranjeeth_Pi_Owner_2026", // लोगो पर 5 बार टैप करने पर लगने वाली सीक्रेट की
  version: "3.0.0",
  sandboxMode: true,
  defaultSummaryPricePi: 0.5,
  defaultMeetingPassPi: 2.0,
  platformCommissionPercent: 15,
  apiEndpoint: "/api/sync"
};

export const LANGUAGE_LIST = [
  { code: "hi", flag: "🇮🇳", name: "हिंदी (Hindi)" },
  { code: "en", flag: "🌐", name: "English" },
  { code: "bho", flag: "🇮🇳", name: "भोजपुरी (Bhojpuri)" },
  { code: "mai", flag: "🇮🇳", name: "मैथिली (Maithili)" },
  { code: "bn", flag: "🇮🇳", name: "বাংলা (Bengali)" },
  { code: "mr", flag: "🇮🇳", name: "मराठी (Marathi)" },
  { code: "te", flag: "🇮🇳", name: "తెలుగు (Telugu)" },
  { code: "ta", flag: "🇮🇳", name: "தமிழ் (Tamil)" },
  { code: "gu", flag: "🇮🇳", name: "ગુજરાતી (Gujarati)" },
  { code: "ur", flag: "🇮🇳", name: "اردو (Urdu)" },
  { code: "kn", flag: "🇮🇳", name: "ಕನ್ನಡ (Kannada)" },
  { code: "or", flag: "🇮🇳", name: "ଓଡ଼ିଆ (Odia)" },
  { code: "ml", flag: "🇮🇳", name: "മലയാളം (Malayalam)" },
  { code: "pa", flag: "🇮🇳", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "as", flag: "🇮🇳", name: "অসমীয়া (Assamese)" },
  { code: "ne", flag: "🇳🇵", name: "नेपाली (Nepali)" },
  { code: "es", flag: "🇪🇸", name: "Español (Spanish)" },
  { code: "zh", flag: "🇨🇳", name: "中文 (Chinese)" },
  { code: "ar", flag: "🇸🇦", name: "العربية (Arabic)" },
  { code: "fr", flag: "🇫🇷", name: "Français (French)" },
  { code: "ru", flag: "🇷🇺", name: "Русский (Russian)" },
  { code: "pt", flag: "🇧🇷", name: "Português (Portuguese)" },
  { code: "id", flag: "🇮🇩", name: "Indonesia" },
  { code: "de", flag: "🇩🇪", name: "Deutsch (German)" },
  { code: "ja", flag: "🇯🇵", name: "日本語 (Japanese)" },
  { code: "ko", flag: "🇰🇷", name: "한국어 (Korean)" },
  { code: "vi", flag: "🇻🇳", name: "Tiếng Việt (Vietnamese)" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe (Turkish)" },
  { code: "fa", flag: "🇮🇷", name: "فارسی (Persian)" },
  { code: "th", flag: "🇹🇭", name: "ไทย (Thai)" },
  { code: "it", flag: "🇮🇹", name: "Italiano (Italian)" },
  { code: "pl", flag: "🇵🇱", name: "Polski (Polish)" },
  { code: "uk", flag: "🇺🇦", name: "Українська (Ukrainian)" },
  { code: "nl", flag: "🇳🇱", name: "Nederlands (Dutch)" },
  { code: "ms", flag: "🇲🇾", name: "Melayu (Malay)" },
  { code: "tl", flag: "🇵🇭", name: "Filipino (Tagalog)" },
  { code: "sw", flag: "🇰🇪", name: "Kiswahili (Swahili)" },
  { code: "ro", flag: "🇷🇴", name: "Română (Romanian)" },
  { code: "el", flag: "🇬🇷", name: "Ελληνικά (Greek)" },
  { code: "cs", flag: "🇨🇿", name: "Čeština (Czech)" },
  { code: "sv", flag: "🇸🇪", name: "Svenska (Swedish)" },
  { code: "hu", flag: "🇭🇺", name: "Magyar (Hungarian)" }
];

const BASE_TRANSLATIONS = {
  hi: {
    legal_title: "कानूनी सुरक्षा और प्राइवेसी सहमति",
    legal_agree: "मैं 18+ वर्ष का हूँ और PiSphere की शर्तों, प्राइवेसी पॉलिसी, AI मीटिंग समरी और लोकल विज्ञापन नियमों से सहमत हूँ।",
    accept_continue: "सहमत हैं और आगे बढ़ें",
    local_ad_badge: "लोकल विज्ञापन",
    chat_btn: "चैट",
    support_btn: "सहायता",
    nav_chats: "चैट्स",
    nav_meetings: "मीटिंग",
    nav_feed: "लोकल हब",
    nav_wallet: "रिवॉर्ड्स",
    nav_admin: "एडमिन",
    chats_heading: "स्मार्ट चैट्स और वीआईपी ग्रुप्स",
    new_group_btn: "+ नया ग्रुप",
    open_badge: "खुला है",
    locked_badge: "लॉक है",
    pioneers_encrypted: "पायनियर्स • एन्क्रिप्टेड",
    online_safe: "ऑनलाइन • सेफ-हार्बर सुरक्षित",
    live_meet_btn: "लाइव मीट",
    report_btn: "रिपोर्ट",
    chat_placeholder: "ग्रुप में मैसेज लिखें...",
    meet_heading: "100-यूजर क्लाउड मीटिंग रूम",
    room_id_label: "रूम आईडी",
    free_tier_label: "30-मिनट फ्री टियर",
    ready_badge: "तैयार",
    start_meet_btn: "100-यूजर मीटिंग शुरू करें",
    pro_host_btn: "प्रो होस्ट पास (2 π)",
    active_speakers_label: "सक्रिय वक्ता (4 फ्रंट + ग्रिड)",
    audio_only_mode: "ऑडियो-ओनली (कम डेटा)",
    hd_video_mode: "एचडी वीडियो मोड",
    end_meet_btn: "मीटिंग समाप्त करें और AI समरी बनाएं",
    summary_vault_heading: "AI मीटिंग समरी वॉल्ट (पे-पर-यूजर)",
    per_user_label: "प्रति यूजर",
    unlocked_badge: "अनलॉक",
    locked_mom_tag: "[लॉक है — पूरी समरी पढ़ने के लिए पे करें]",
    unlock_summary_btn: "पूरी समरी अनलॉक और डाउनलोड करें",
    download_txt_btn: "ऑफिशियल समरी डाउनलोड करें (.TXT)",
    feed_heading: "सोशल फीड और लोकल सर्विसेज",
    post_offer_btn: "+ ऑफर पोस्ट करें",
    book_service_btn: "सर्विस बुक करें",
    wallet_subtitle: "PiSphere अटेंडेंस और रिवॉर्ड पॉइंट्स",
    watch_ad_btn: "Pi विज्ञापन देखें (+25 PTS)",
    blue_tick_label: "वेरिफाइड ब्लू-टिक बैज (मासिक)",
    activate_btn: "एक्टिवेट करें",
    gdpr_delete_label: "मेरा डेटा डिलीट करने का अधिकार (GDPR)",
    delete_data_btn: "डेटा रीसेट करें",
    recent_activity: "हाल की गतिविधि और बोनस",
    welcome_bonus: "पायनियर वेलकम बोनस",
    support_modal_title: "डायरेक्ट एडमिन सपोर्ट और शिकायत चैट",
    support_modal_sub: "आपका मैसेज आपके यूजरनेम और आईडी के साथ सीधे एडमिन को फ्लैश होगा",
    support_issue_type: "समस्या का प्रकार चुनें",
    support_placeholder: "अपनी समस्या या सवाल यहाँ विस्तार से लिखें...",
    support_send_btn: "एडमिन को सीधा मैसेज भेजें",
    admin_heading: "सुपर एडमिन कमांड सेंटर",
    admin_sub: "ओनर कंट्रोल • लाइव सपोर्ट, पॉपअप टेम्पलेट और समरी वॉल्ट",
    summary_earned_label: "समरी अनलॉक कमाई",
    ads_earned_label: "लोकल ऐड और VIP कमाई",
    support_inbox_heading: "लाइव यूजर सपोर्ट और शिकायत इनबॉक्स",
    reply_btn: "रिप्लाई भेजें",
    template_studio_heading: "मेन स्क्रीन पॉपअप टेम्पलेट ऐड स्टूडियो (4s लॉक)",
    launch_template_btn: "मेन स्क्रीन पर टेम्पलेट ऐड लॉन्च करें",
    local_ad_studio_heading: "क्लाउड मीटिंग बार के लिए लोकल ऐड बनाएं",
    biz_name_placeholder: "दुकान / बिजनेस का नाम लिखें...",
    ad_msg_placeholder: "विज्ञापन संदेश और ऑफर लिखें...",
    publish_ad_btn: "+ सभी क्लाउड मीटिंग्स पर लाइव ऐड चलाएं",
    summary_price_heading: "प्रति-यूजर समरी अनलॉक रेट (π)",
    summary_price_sub: "मीटिंग समरी डाउनलोड करने का प्रति यूजर शुल्क",
    safety_heading: "IT एक्ट धारा 79 सेफ्टी रिपोर्ट्स और किल-स्विच",
    block_id_btn: "आईडी ब्लॉक करें"
  },
  en: {
    legal_title: "Legal Shield & Privacy Consent",
    legal_agree: "I am 18+ years old and agree to PiSphere's Terms, Privacy Policy, AI Meeting Summary & Local Ad rules.",
    accept_continue: "Accept & Continue Safely",
    local_ad_badge: "LOCAL AD",
    chat_btn: "Chat",
    support_btn: "Support",
    nav_chats: "Chats",
    nav_meetings: "Meetings",
    nav_feed: "Local Hub",
    nav_wallet: "Rewards",
    nav_admin: "Admin",
    chats_heading: "SMART CHATS & VIP GROUPS",
    new_group_btn: "+ New Group",
    open_badge: "Open",
    locked_badge: "Locked",
    pioneers_encrypted: "Pioneers • End-to-End Protected",
    online_safe: "Online • Safe-Harbor Active",
    live_meet_btn: "Live Meet",
    report_btn: "Report",
    chat_placeholder: "Write a message in group...",
    meet_heading: "100-User Cloud Meeting Room",
    room_id_label: "Room ID",
    free_tier_label: "30-Min Free Tier",
    ready_badge: "READY",
    start_meet_btn: "Start 100-User Meet",
    pro_host_btn: "Pro Host Pass (2 π)",
    active_speakers_label: "Active Speakers (4 Front + Grid)",
    audio_only_mode: "Audio-Only (Low Data)",
    hd_video_mode: "HD Video Mode",
    end_meet_btn: "End Meeting & Generate AI Summary",
    summary_vault_heading: "AI MEETING SUMMARY VAULT (PAY-PER-USER)",
    per_user_label: "Per User",
    unlocked_badge: "UNLOCKED",
    locked_mom_tag: "[Locked — Pay to Read Full MOM]",
    unlock_summary_btn: "Unlock & Download Full Summary",
    download_txt_btn: "Download Official Summary (.TXT)",
    feed_heading: "Social Feed & Local Services",
    post_offer_btn: "+ Post Offer",
    book_service_btn: "Book Service",
    wallet_subtitle: "PiSphere Attendance & Reward Points",
    watch_ad_btn: "Watch Pi Ad (+25 PTS)",
    blue_tick_label: "Verified Blue-Tick Badge (Monthly)",
    activate_btn: "Activate",
    gdpr_delete_label: "Right to Delete My Data (GDPR)",
    delete_data_btn: "Reset Data",
    recent_activity: "Recent Pi & Reward Activity",
    welcome_bonus: "Initial Pioneer Welcome Bonus",
    support_modal_title: "Direct Admin Support & Complaint Chat",
    support_modal_sub: "Your message flashes directly on Admin Panel with your Username & ID",
    support_issue_type: "Select Issue Category",
    support_placeholder: "Describe your issue or query for the Admin...",
    support_send_btn: "Send Direct Message to Admin",
    admin_heading: "Super Admin Command Center",
    admin_sub: "Owner Control • Live Support, Popup Templates & Summary Vault",
    summary_earned_label: "Summary Unlocks Earned",
    ads_earned_label: "Local Ads & VIP Revenue",
    support_inbox_heading: "Live User Support & Flashing Complaints Inbox",
    reply_btn: "Send Reply",
    template_studio_heading: "Main Screen Popup Template Ad Studio (4s Lock)",
    launch_template_btn: "Launch Popup Template Ad on Main Screen",
    local_ad_studio_heading: "Create Local Ad for Cloud Meeting Bar",
    biz_name_placeholder: "Business / Shop Name...",
    ad_msg_placeholder: "Write ad offer & contact details...",
    publish_ad_btn: "+ Publish Live Ad on All Cloud Meetings",
    summary_price_heading: "Per-User Summary Unlock Price (π)",
    summary_price_sub: "Charge per user for downloading meeting summary",
    safety_heading: "IT Act Sec 79 Safety Reports & Kill-Switch",
    block_id_btn: "Block ID"
  }
};

// Multi-Language SmartOverrides for Regional & Global Languages
const LANG_OVERRIDES = {
  bho: {
    nav_chats: "चैट्स", nav_meetings: "मीटिंग", nav_feed: "लोकल हब", nav_wallet: "रिवॉर्ड", nav_admin: "एडमिन",
    chats_heading: "स्मार्ट चैट अउर वीआईपी ग्रुप", new_group_btn: "+ नया ग्रुप", meet_heading: "100-यूजर क्लाउड मीटिंग रूम",
    start_meet_btn: "100-यूजर मीटिंग सुरू करीं", pro_host_btn: "प्रो होस्ट पास (2 π)",
    summary_vault_heading: "AI मीटिंग समरी वॉल्ट (प्रति यूजर)", unlock_summary_btn: "पूरा समरी अनलॉक आ डाउनलोड करीं",
    feed_heading: "सोशल फीड अउर लोकल सर्विस", post_offer_btn: "+ ऑफर पोस्ट करीं", book_service_btn: "सर्विस बुक करीं",
    support_btn: "सपोर्ट", support_modal_title: "डायरेक्ट एडमिन सपोर्ट चैट"
  },
  bn: {
    nav_chats: "চ্যাট", nav_meetings: "মিটিং", nav_feed: "লোকাল হাব", nav_wallet: "রিওয়ার্ড", nav_admin: "অ্যাডমিন",
    chats_heading: "স্মার্ট চ্যাট এবং ভিআইপি গ্রুপ", new_group_btn: "+ নতুন গ্রুপ", meet_heading: "১০০-ইউজার ক্লাউড মিটিং রুম",
    start_meet_btn: "১০০-ইউজার মিটিং শুরু করুন", pro_host_btn: "প্রো হোস্ট পাস (২ π)",
    summary_vault_heading: "AI মিটিং সামারি ভল্ট", unlock_summary_btn: "সম্পূর্ণ সামারি আনলক ও ডাউনলোড করুন",
    feed_heading: "সোশ্যাল ফিড ও লোকাল সার্ভিস", post_offer_btn: "+ অফার পোস্ট করুন", book_service_btn: "সার্ভিস বুক করুন",
    support_btn: "সাপোর্ট"
  },
  mr: {
    nav_chats: "चॅट्स", nav_meetings: "मीटिंग", nav_feed: "लोकल हब", nav_wallet: "रिवॉर्ड्स", nav_admin: "अ‍ॅडमिन",
    chats_heading: "स्मार्ट चॅट्स आणि व्हीआयपी ग्रुप्स", new_group_btn: "+ नवीन ग्रुप", meet_heading: "100-यूजर क्लाउड मीटिंग रूम",
    start_meet_btn: "100-यूजर मीटिंग सुरू करा", pro_host_btn: "प्रो होस्ट पास (2 π)",
    summary_vault_heading: "AI मीटिंग समरी व्हॉल्ट", unlock_summary_btn: "पूर्ण समरी अनलॉक आणि डाउनलोड करा",
    feed_heading: "सोशल फीड आणि लोकल सर्व्हिसेस", post_offer_btn: "+ ऑफर पोस्ट करा", book_service_btn: "सर्व्हिस बुक करा",
    support_btn: "मदत"
  },
  te: {
    nav_chats: "చాట్స్", nav_meetings: "మీటింగ్", nav_feed: "లోకల్ హబ్", nav_wallet: "రివార్డ్స్", nav_admin: "అడ్మిన్",
    chats_heading: "స్మార్ట్ చాట్స్ & VIP గ్రూప్స్", new_group_btn: "+ కొత్త గ్రూప్", meet_heading: "100-యూజర్ క్లౌడ్ మీటింగ్ రూమ్",
    start_meet_btn: "మీటింగ్ ప్రారంభించండి", pro_host_btn: "ప్రో హోస్ట్ పాస్ (2 π)",
    summary_vault_heading: "AI మీటింగ్ సమ్మరీ వాల్ట్", unlock_summary_btn: "సమ్మరీ అన్‌లాక్ & డౌన్‌లోడ్ చేయండి",
    feed_heading: "సోషల్ ఫీడ్ & లోకల్ సర్వీసెస్", post_offer_btn: "+ ఆఫర్ పోస్ట్ చేయండి", book_service_btn: "బుక్ చేయండి"
  },
  ta: {
    nav_chats: "அரட்டை", nav_meetings: "மீட்டிங்", nav_feed: "லோக்கல் ஹப்", nav_wallet: "ரிவார்ட்ஸ்", nav_admin: "அட்மின்",
    chats_heading: "ஸ்மார்ட் சாட் & VIP குழுக்கள்", new_group_btn: "+ புதிய குழு", meet_heading: "100-பயனர் கிளவுட் மீட்டிங்",
    start_meet_btn: "மீட்டிங்கைத் தொடங்கு", pro_host_btn: "புரோ பாஸ் (2 π)",
    summary_vault_heading: "AI மீட்டிங் சுருக்க வால்ட்", unlock_summary_btn: "சுருக்கத்தை திறந்து பதிவிறக்கவும்",
    feed_heading: "சோஷியல் ஃபீட் & உள்ளூர் சேவைகள்", post_offer_btn: "+ ஆஃபர் போஸ்ட்", book_service_btn: "சேவை முன்பதிவு"
  },
  zh: {
    nav_chats: "聊天", nav_meetings: "云会议", nav_feed: "本地服务", nav_wallet: "奖励", nav_admin: "管理",
    chats_heading: "智能聊天与 VIP 群组", new_group_btn: "+ 新建群组", open_badge: "开放", locked_badge: "已锁定",
    meet_heading: "100人云端视频会议室", start_meet_btn: "发起100人云会议", pro_host_btn: "主持通行证 (2 π)",
    summary_vault_heading: "AI 会议摘要库 (按次解锁)", unlock_summary_btn: "解锁并下载完整会议摘要",
    feed_heading: "全球动态与本地服务", post_offer_btn: "+ 发布服务", book_service_btn: "立即预订服务",
    wallet_subtitle: "PiSphere 签到与奖励积分", watch_ad_btn: "观看 Pi 广告 (+25 积分)", support_btn: "客服"
  },
  es: {
    nav_chats: "Chats", nav_meetings: "Reunión", nav_feed: "Local", nav_wallet: "Premios", nav_admin: "Admin",
    chats_heading: "CHATS Y GRUPOS VIP", new_group_btn: "+ Nuevo Grupo", meet_heading: "Sala en la Nube (100 Usuarios)",
    start_meet_btn: "Iniciar Reunión 100", pro_host_btn: "Pase Anfitrión (2 π)",
    summary_vault_heading: "BÓVEDA DE RESÚMENES IA", unlock_summary_btn: "Desbloquear y Descargar Resumen",
    feed_heading: "Feed Social y Servicios Locales", post_offer_btn: "+ Publicar Oferta", book_service_btn: "Reservar Servicio",
    support_btn: "Soporte"
  },
  ar: {
    nav_chats: "الدردشة", nav_meetings: "الاجتماعات", nav_feed: "الخدمات", nav_wallet: "المكافآت", nav_admin: "الإدارة",
    chats_heading: "الدردشات الذكية ومجموعات VIP", new_group_btn: "+ مجموعة جديدة", meet_heading: "غرفة اجتماعات سحابية (100 مستخدم)",
    start_meet_btn: "بدء اجتماع سحابي", pro_host_btn: "بطاقة المضيف (2 π)",
    summary_vault_heading: "خزنة ملخصات الاجتماعات بالذكاء الاصطناعي", unlock_summary_btn: "فتح وتحميل الملخص الكامل",
    feed_heading: "المنشورات والخدمات المحلية", post_offer_btn: "+ نشر عرض", book_service_btn: "حجز الخدمة",
    support_btn: "الدعم"
  },
  fa: {
    nav_chats: "چت‌ها", nav_meetings: "جلسات", nav_feed: "خدمات محلی", nav_wallet: "پاداش‌ها", nav_admin: "مدیریت",
    chats_heading: "چت‌های هوشمند و گروه‌های VIP", new_group_btn: "+ گروه جدید", meet_heading: "اتاق جلسه ابری ۱۰۰ نفره",
    start_meet_btn: "شروع جلسه ۱۰۰ نفره", pro_host_btn: "کارت میزبان (2 π)",
    summary_vault_heading: "بایگانی خلاصه جلسات هوش مصنوعی", unlock_summary_btn: "بازگشایی و دانلود خلاصه کامل",
    feed_heading: "فید اجتماعی و خدمات محلی", post_offer_btn: "+ ثبت پیشنهاد", book_service_btn: "رزرو سرویس",
    support_btn: "پشتیبانی"
  },
  fr: {
    nav_chats: "Discussions", nav_meetings: "Réunions", nav_feed: "Local", nav_wallet: "Bonus", nav_admin: "Admin",
    chats_heading: "CHATS ET GROUPES VIP", new_group_btn: "+ Nouveau Groupe", meet_heading: "Salle Cloud 100 Participants",
    start_meet_btn: "Démarrer Réunion", pro_host_btn: "Pass Hôte (2 π)",
    summary_vault_heading: "RÉSUMÉS IA DES RÉUNIONS", unlock_summary_btn: "Débloquer et Télécharger le Résumé",
    feed_heading: "Flux Social & Services Locaux", post_offer_btn: "+ Publier Offre", book_service_btn: "Réserver",
    support_btn: "Support"
  },
  ru: {
    nav_chats: "Чаты", nav_meetings: "Встречи", nav_feed: "Сервисы", nav_wallet: "Награды", nav_admin: "Админ",
    chats_heading: "ЧАТЫ И VIP ГРУППЫ", new_group_btn: "+ Новая группа", meet_heading: "Облачная комната (100 участников)",
    start_meet_btn: "Начать встречу", pro_host_btn: "PRO пропуск (2 π)",
    summary_vault_heading: "ИИ КОНСПЕКТЫ ВСТРЕЧ", unlock_summary_btn: "Разблокировать и скачать конспект",
    feed_heading: "Лента и Местные Услуги", post_offer_btn: "+ Добавить услугу", book_service_btn: "Заказать",
    support_btn: "Помощь"
  }
};

export function getTranslator(langCode) {
  const indicCodes = ["hi", "bho", "mai", "ne", "gu", "pa", "or", "as", "kn", "ml"];
  const base = indicCodes.includes(langCode) ? BASE_TRANSLATIONS.hi : BASE_TRANSLATIONS.en;
  const override = LANG_OVERRIDES[langCode] || {};
  return function t(key) {
    return override[key] || base[key] || BASE_TRANSLATIONS.en[key] || key;
  };
}

export async function payWithPiSDK(amountPi, memoText, metadataObj, username, onSuccess) {
  const finish = async (txid) => {
    try {
      await fetch(PiSphereConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "payment",
          username: username || "Pioneer_User",
          amountPi: Number(amountPi),
          memo: memoText,
          txid
        })
      });
    } catch (e) {}
    if (onSuccess) onSuccess(txid);
  };

  if (typeof window === "undefined" || !window.Pi) {
    const ok = window.confirm(`[Pi Sandbox Payment]\n\nService: ${memoText}\nAmount: ${amountPi} π\n\nApprove test payment?`);
    if (ok) finish("sandbox_tx_" + Date.now());
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
        onReadyForServerApproval: (paymentId) => console.log("Approval:", paymentId),
        onReadyForServerCompletion: (paymentId, txid) => finish(txid),
        onCancel: () => alert("Payment cancelled."),
        onError: () => {
          const ok = window.confirm(`[Testing Mode]\nUnlock ${memoText} (${amountPi} π)?`);
          if (ok) finish("test_tx_" + Date.now());
        }
      }
    );
  } catch (err) {
    const ok = window.confirm(`[Testing Mode]\nUnlock ${memoText} (${amountPi} π)?`);
    if (ok) finish("test_tx_" + Date.now());
  }
}

export async function triggerPiAd(adType = "interstitial", onReward) {
  try {
    if (typeof window !== "undefined" && window.Pi && window.Pi.Ads) {
      const ready = await window.Pi.Ads.isAdReady(adType);
      if (!ready.ready) await window.Pi.Ads.requestAd(adType);
      const res = await window.Pi.Ads.showAd(adType);
      if (res.result === "AD_REWARDED" || res.result === "AD_CLOSED") {
        if (onReward) onReward();
      }
      return;
    }
  } catch (e) {}
  alert(`📺 [Pi Ad Network — ${adType.toUpperCase()}]\nSponsored Pi Ecosystem Ad Completed!`);
  if (onReward) onReward();
}
Displaying 1000467041.png. 
