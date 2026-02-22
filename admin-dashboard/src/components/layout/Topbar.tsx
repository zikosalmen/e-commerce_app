import { useAuthStore } from '@/store/authStore';
import { Menu, Sun, Moon, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s: any) => s.user);
  const location = useLocation();

  const routeLabels: Record<string, string> = {
    '/admin': t('nav.dashboard'),
    '/admin/products': t('nav.products'),
    '/admin/categories': t('nav.categories'),
    '/admin/orders': t('nav.orders'),
    '/admin/users': t('nav.users'),
    '/admin/settings': t('nav.settings'),
    '/admin/auto-posting': t('nav.autoPosting'),
    '/admin/auto-posting/logs': t('nav.automationLogs'),
    '/admin/auto-reply': t('nav.autoReply'),
  };

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'dark';
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const pageTitle = routeLabels[location.pathname] ?? t('auth.title');
  const initials = user?.email?.charAt(0).toUpperCase() ?? 'A';

  return (
    <header className="h-20 flex items-center justify-between px-6 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-30 gap-6">
      
      {/* Search Bar - Desktop Only */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative group">
        <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder={t('common.search')}
          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
      </div>

      {/* Mobile: Hamburger + Title */}
      <div className="flex items-center gap-4 md:hidden min-w-0">
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        
        {/* Toggle Dark Mode */}
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-all cursor-pointer relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={dark ? 'moon' : 'sun'}
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              {dark ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
          </AnimatePresence>
        </button>

        <div className="h-8 w-px bg-[var(--border-color)] mx-1 hidden sm:block" />

        {/* User Card */}
        <div className="flex items-center gap-3 pl-1 pr-1 sm:pr-2 py-1 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">{t('common.administrator')}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
