import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bot,
  MessageSquareShare,
  X,
  Store,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { t } = useTranslation();
  const logout = useAuthStore((s: any) => s.logout);
  const location = useLocation();

  const navItems = [
    { to: '/admin',              icon: LayoutDashboard, label: t('nav.dashboard'),    end: true },
    { to: '/admin/products',     icon: Package,         label: t('nav.products') },
    { to: '/admin/categories',   icon: Tags,            label: t('nav.categories') },
    { to: '/admin/orders',       icon: ShoppingCart,    label: t('nav.orders') },
    { to: '/admin/users',        icon: Users,           label: t('nav.users') },
    { to: '/admin/auto-posting', icon: Bot,             label: t('nav.autoPosting') },
    { to: '/admin/auto-reply',   icon: MessageSquareShare, label: t('nav.autoReply') },
    { to: '/admin/settings',     icon: Settings,        label: t('nav.settings') },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          x: open || window.innerWidth >= 1024 ? 0 : -280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-[var(--sidebar-bg)] border-r border-white/5 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 shrink-0 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 overflow-hidden p-2 transition-transform hover:scale-105 border border-white/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="font-bold text-white text-base leading-none">First Shop</span>
                <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-0.5">{t('common.administrator')}</span>
              </motion.div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 rounded-full bg-indigo-600 items-center justify-center text-white shadow-lg cursor-pointer hover:bg-indigo-500 transition-colors z-50"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                className={`
                  relative flex items-center gap-3 rounded-xl transition-all duration-200 group no-underline
                  ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}
                  ${isActive 
                    ? 'bg-indigo-600/10 text-white font-medium' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  size={22}
                  className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-200'}`}
                />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info / Logout */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full rounded-xl transition-all duration-200 group cursor-pointer
              ${collapsed ? 'justify-center p-3' : 'px-4 py-3'}
              text-slate-400 hover:bg-red-500/10 hover:text-red-400
            `}
          >
            <LogOut size={22} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{t('nav.logout')}</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
