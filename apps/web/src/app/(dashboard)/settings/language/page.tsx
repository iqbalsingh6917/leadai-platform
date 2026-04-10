'use client';

import { useState, useEffect } from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

type LangCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';

const TRANSLATIONS: Record<LangCode, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard', leads: 'Leads', contacts: 'Contacts', pipeline: 'Pipeline',
    campaigns: 'Campaigns', analytics: 'Analytics', team: 'Team', billing: 'Billing',
    settings: 'Settings', logout: 'Logout', search: 'Search', newLead: 'New Lead',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', status: 'Status',
    name: 'Name', email: 'Email', phone: 'Phone',
  },
  hi: {
    dashboard: 'डैशबोर्ड', leads: 'लीड्स', contacts: 'संपर्क', pipeline: 'पाइपलाइन',
    campaigns: 'अभियान', analytics: 'विश्लेषण', team: 'टीम', billing: 'बिलिंग',
    settings: 'सेटिंग्स', logout: 'लॉग आउट', search: 'खोज', newLead: 'नई लीड',
    save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', edit: 'संपादित करें',
    status: 'स्थिति', name: 'नाम', email: 'ईमेल', phone: 'फ़ोन',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', leads: 'லீட்ஸ்', contacts: 'தொடர்புகள்', pipeline: 'பைப்லைன்',
    campaigns: 'பிரசாரங்கள்', analytics: 'பகுப்பாய்வு', team: 'குழு', billing: 'பில்லிங்',
    settings: 'அமைப்புகள்', logout: 'வெளியேறு', search: 'தேடு', newLead: 'புதிய லீட்',
    save: 'சேமி', cancel: 'ரத்து செய்', delete: 'நீக்கு', edit: 'திருத்து',
    status: 'நிலை', name: 'பெயர்', email: 'மின்னஞ்சல்', phone: 'தொலைபேசி',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్', leads: 'లీడ్స్', contacts: 'పరిచయాలు', pipeline: 'పైప్‌లైన్',
    campaigns: 'ప్రచారాలు', analytics: 'విశ్లేషణలు', team: 'జట్టు', billing: 'బిల్లింగ్',
    settings: 'సెట్టింగ్‌లు', logout: 'లాగ్ అవుట్', search: 'శోధించు', newLead: 'కొత్త లీడ్',
    save: 'సేవ్ చేయి', cancel: 'రద్దు చేయి', delete: 'తొలగించు', edit: 'సవరించు',
    status: 'స్థితి', name: 'పేరు', email: 'ఇమెయిల్', phone: 'ఫోన్',
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড', leads: 'লিডস', contacts: 'পরিচিতি', pipeline: 'পাইপলাইন',
    campaigns: 'প্রচারাভিযান', analytics: 'বিশ্লেষণ', team: 'দল', billing: 'বিলিং',
    settings: 'সেটিংস', logout: 'লগ আউট', search: 'অনুসন্ধান', newLead: 'নতুন লিড',
    save: 'সংরক্ষণ', cancel: 'বাতিল', delete: 'মুছুন', edit: 'সম্পাদনা',
    status: 'অবস্থা', name: 'নাম', email: 'ইমেইল', phone: 'ফোন',
  },
};

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
];

export default function LanguagePage() {
  const [selectedLang, setSelectedLang] = useState<LangCode>('en');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('preferred-language') as LangCode | null;
    if (stored && TRANSLATIONS[stored]) {
      setSelectedLang(stored);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('preferred-language', selectedLang);
    setSaved(true);
    toast.success('Language preference saved!');
    setTimeout(() => setSaved(false), 3000);
  };

  const translations = TRANSLATIONS[selectedLang];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Language Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Choose your preferred language for the interface</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Selector */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Select Language</h2>
            </div>
            <div className="space-y-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    selectedLang === lang.code
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`font-medium text-sm ${selectedLang === lang.code ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {lang.label}
                  </span>
                  {selectedLang === lang.code && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Button onClick={handleSave} className="w-full">
                {saved ? <CheckCircle2 className="w-4 h-4" /> : null}
                {saved ? 'Saved!' : 'Save Preference'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Translation Preview */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                Translation Preview —{' '}
                <span className="text-indigo-600">
                  {LANGUAGES.find((l) => l.code === selectedLang)?.label}
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-1/3">
                      Key
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      English
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Translation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(translations).map(([key, value]) => (
                    <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          {key}
                        </code>
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        {TRANSLATIONS.en[key]}
                      </td>
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {selectedLang === 'en' ? (
                          <span className="text-slate-400 italic">Same as English</span>
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
