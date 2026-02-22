import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Lock, ShieldCheck, Languages } from 'lucide-react';
import { Button, PageHeader } from '@/components/ui';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('settings.security.mismatch'));
      return;
    }
    if (password.length < 6) {
      toast.error(t('settings.security.lengthError'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success(t('settings.security.success'));
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(t('settings.security.error'));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <PageHeader 
        title={t('settings.title')} 
        subtitle={t('settings.subtitle')} 
      />

      <div className="max-w-2xl space-y-6">
        {/* Language Selection */}
        <section className="card-premium p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Languages size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{t('settings.language.title')}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('settings.language.subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                i18n.language.startsWith('en') 
                  ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' 
                  : 'border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-2xl font-black mb-1">EN</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">English</span>
            </button>
            
            <button
              onClick={() => changeLanguage('fr')}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                i18n.language.startsWith('fr') 
                  ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500' 
                  : 'border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-2xl font-black mb-1">FR</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Français</span>
            </button>
          </div>
        </section>

        <section className="card-premium p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{t('settings.security.title')}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('settings.security.subtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('settings.security.newKey')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('settings.security.confirmKey')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                loading={loading} 
                disabled={!password}
                icon={<ShieldCheck size={18} />}
                className="w-full md:w-auto px-10 h-14 bg-indigo-600 shadow-lg shadow-indigo-500/20"
              >
                {t('settings.security.update')}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
