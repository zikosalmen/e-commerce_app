import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'fr' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group cursor-pointer text-slate-400 hover:bg-white/5 hover:text-slate-200"
      title={i18n.language.startsWith('en') ? 'Passer en Français' : 'Switch to English'}
    >
      <Languages size={20} className="shrink-0 transition-colors group-hover:text-indigo-400" />
      <span className="text-xs font-black uppercase tracking-widest leading-none">
        {i18n.language.startsWith('en') ? 'FR' : 'EN'}
      </span>
    </button>
  );
}
