'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePiSphere } from '@/app/layout';
import { clean } from '@/lib/sanitize';

const UI_TEXT = {
  hi: {
    pageTitle: 'प्रोफाइल और सुरक्षा सेटिंग्स',
    pageSub: 'चैट, क्लाउड मीटिंग, पोस्ट फीड और वॉलेट के सभी फीचर्स खोलने के लिए अपनी असली जानकारी भरें।',
    uploadLabel: 'प्रोफाइल फोटो अपलोड करें (हेडर पर दिखेगा)',
    choosePhoto: '📷 फोटो चुनें',
    realNameLabel: 'असली नाम (Real Name) *',
    realNamePh: 'अपना पूरा असली नाम लिखें',
    mobileLabel: 'मोबाइल नंबर *',
    mobilePh: '+91 9876543210',
    gmailLabel: 'जीमेल आईडी (Gmail) *',
    gmailPh: 'example@gmail.com',
    countryLabel: 'देश (Country) *',
    stateLabel: 'राज्य (State) *',
    cityLabel: 'शहर (City) *',
    warningText: 'चेतावनी: गलत या फर्जी प्रोफाइल डेटा भरने पर आपको Sphere Points (SP) से वंचित कर दिया जाएगा और कोई रिवॉर्ड नहीं मिलेगा। मैं पुष्टि करता/करती हूँ कि ऊपर दिया गया डेटा 100% सत्य है।',
    visibilityTitle: 'प्रोफाइल विजिबिलिटी मोड चुनें',
    publicBtn: '🌐 पब्लिक (Public — SP रिवॉर्ड पात्र)',
    privateBtn: '🔒 प्राइवेट (Private — 0 SP रिवॉर्ड)',
    visibilityNote: 'नोट: प्राइवेट प्रोफाइल किसी को दिखाई नहीं देगी, लेकिन प्राइवेट यूज़र को Sphere Points (SP) नहीं मिलते। केवल पब्लिक यूज़र को ही SP रिवॉर्ड मिलता है।',
    submitBtn: '✓ प्रोफाइल सेव करें और आगे बढ़ें',
    savedToast: 'प्रोफाइल सफलतापूर्वक अपडेट हो गया!',
    errIncomplete: 'कृपया सभी ज़रूरी जानकारी भरें और चेतावनी बॉक्स पर राइट (✓) टिक करें।',
    backWalletBtn: '← वॉलेट पर वापस जाएं',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  },
  en: {
    pageTitle: 'Profile & Security Settings',
    pageSub: 'Fill in your real details to unlock Chat, Cloud Meeting, Post Feed, and Wallet features.',
    uploadLabel: 'Upload Profile Photo (Syncs to Top Header)',
    choosePhoto: '📷 Choose Photo',
    realNameLabel: 'Real Full Name *',
    realNamePh: 'Enter your real full name',
    mobileLabel: 'Mobile Number *',
    mobilePh: '+91 9876543210',
    gmailLabel: 'Gmail Address *',
    gmailPh: 'example@gmail.com',
    countryLabel: 'Country *',
    stateLabel: 'State *',
    cityLabel: 'City *',
    warningText: 'Warning: Submitting false or fake profile data will disqualify you from receiving Sphere Points (SP). I confirm that the information provided above is 100% accurate.',
    visibilityTitle: 'Select Profile Visibility Mode',
    publicBtn: '🌐 Public (Eligible for SP Rewards)',
    privateBtn: '🔒 Private (Hidden — 0 SP Rewards)',
    visibilityNote: 'Note: A Private profile is hidden from everyone, but Private users do NOT receive Sphere Points (SP). Only Public users earn SP rewards.',
    submitBtn: '✓ Save Profile & Unlock App',
    savedToast: 'Profile saved and synced to header!',
    errIncomplete: 'Please complete all required fields and tick the verification checkbox.',
    backWalletBtn: '← Back to Wallet',
    copyright: '© 2026 PiSphere. All Rights Reserved.'
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const { lang, profile, setProfile } = usePiSphere();
  const tx = UI_TEXT[lang] || UI_TEXT.hi;

  const [form, setForm] = useState({
    realName: profile.realName || '',
    mobile: profile.mobile || '',
    gmail: profile.gmail || '',
    country: profile.country || 'India',
    state: profile.state || '',
    city: profile.city || '',
    visibility: profile.visibility || 'public',
    photoUrl: profile.photoUrl || '',
    warningAccepted: profile.warningAccepted || false,
  });
  const [msg, setMsg] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, photoUrl: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const cleanedName = clean(form.realName, 80);
    const cleanedMobile = clean(form.mobile, 20);
    const cleanedGmail = clean(form.gmail, 80);
    const cleanedCountry = clean(form.country, 50);
    const cleanedState = clean(form.state, 50);
    const cleanedCity = clean(form.city, 50);

    if (
      !cleanedName ||
      !cleanedMobile ||
      !cleanedGmail ||
      !cleanedCountry ||
      !cleanedState ||
      !cleanedCity ||
      !form.warningAccepted
    ) {
      setMsg(tx.errIncomplete);
      return;
    }

    setProfile({
      completed: true,
      realName: cleanedName,
      mobile: cleanedMobile,
      gmail: cleanedGmail,
      country: cleanedCountry,
      state: cleanedState,
      city: cleanedCity,
      visibility: form.visibility,
      photoUrl: form.photoUrl,
      warningAccepted: true,
    });

    setMsg(tx.savedToast);
    setTimeout(() => {
      router.push('/wallet');
    }, 600);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="bg-[#0D0D14] border border-zinc-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-base font-bold text-white">{tx.pageTitle}</h1>
          {profile.completed && (
            <button
              onClick={() => router.push('/wallet')}
              className="px-3 py-1 bg-[#14141F] hover:bg-zinc-800 text-xs text-zinc-200 rounded-lg border border-zinc-700"
            >
              {tx.backWalletBtn}
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-400 mb-4">{tx.pageSub}</p>

        {msg && (
          <div className="mb-4 p-3 rounded-xl bg-[#14141F] border border-zinc-700 text-xs text-white font-medium">
            {msg}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          {/* Profile Photo Upload -> Directly syncs to Top Header */}
          <div className="flex items-center gap-3.5 p-3 bg-[#08080E] border border-zinc-800/90 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-[#14141F] border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-zinc-300">
                  {form.realName ? form.realName.slice(0, 2).toUpperCase() : '👤'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-zinc-200 mb-1.5">{tx.uploadLabel}</div>
              <label className="inline-block px-3 py-1.5 bg-[#14141F] hover:bg-zinc-800 text-xs text-white border border-zinc-700 rounded-lg cursor-pointer transition">
                {tx.choosePhoto}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Real Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">{tx.realNameLabel}</label>
            <input
              type="text"
              value={form.realName}
              onChange={(e) => setForm({ ...form, realName: e.target.value })}
              placeholder={tx.realNamePh}
              className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-600"
            />
          </div>

          {/* Mobile & Gmail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">{tx.mobileLabel}</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder={tx.mobilePh}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">{tx.gmailLabel}</label>
              <input
                type="email"
                value={form.gmail}
                onChange={(e) => setForm({ ...form, gmail: e.target.value })}
                placeholder={tx.gmailPh}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Country, State, City */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">{tx.countryLabel}</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">{tx.stateLabel}</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Bihar"
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">{tx.cityLabel}</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Dehri"
                className="w-full bg-[#08080E] border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Right Tick Warning Box */}
          <label className="flex items-start gap-2.5 p-3 bg-[#08080E] border border-zinc-800 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={form.warningAccepted}
              onChange={(e) => setForm({ ...form, warningAccepted: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-zinc-200 rounded cursor-pointer"
            />
            <span className="text-[11px] text-zinc-300 leading-relaxed">{tx.warningText}</span>
          </label>

          {/* Two Visibility Buttons below Tick Box: Public vs Private */}
          <div className="p-3 bg-[#08080E] border border-zinc-800 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-zinc-200">{tx.visibilityTitle}</div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setForm({ ...form, visibility: 'public' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  form.visibility === 'public'
                    ? 'bg-[#181826] text-white border-zinc-500'
                    : 'bg-[#0D0D14] text-zinc-400 border-zinc-800'
                }`}
              >
                {tx.publicBtn}
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, visibility: 'private' })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  form.visibility === 'private'
                    ? 'bg-[#181826] text-white border-zinc-500'
                    : 'bg-[#0D0D14] text-zinc-400 border-zinc-800'
                }`}
              >
                {tx.privateBtn}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400">{tx.visibilityNote}</p>
          </div>

          {/* Submit Button (Dark Obsidian Theme - Zero Yellow) */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#14141F] hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-700 rounded-xl shadow-lg transition"
          >
            {tx.submitBtn}
          </button>
        </form>
      </div>

      {/* Permanent Copyright Footer */}
      <div className="text-center text-[11px] text-zinc-500 pt-2">
        {tx.copyright}
      </div>
    </div>
  );
}
