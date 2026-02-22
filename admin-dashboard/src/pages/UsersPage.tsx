import { useUsers } from '@/hooks/useUsers';
import { formatDate } from '@/lib/utils';
import { Shield, User as UserIcon, Mail, Calendar, Hash, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function UsersPage() {
  const { t } = useTranslation();
  const { data: users, isLoading } = useUsers();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('users.title')}
        subtitle={`${users?.length ?? 0} ${t('users.subtitle')}`}
      />

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table responsive-table">
            <thead>
              <tr>
                {[t('users.identity'), t('users.email'), t('users.role'), t('users.joined')].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  users?.map((user: any) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={user.id} 
                      className="group"
                    >
                      <td data-label={t('users.identity')}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--border-color)] overflow-hidden shrink-0 transition-all duration-500 group-hover:rotate-6 ${user.role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            {user.image ? (
                              <img src={user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-black uppercase tracking-tighter">
                                {(user.name ?? user.email).charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-black text-[var(--text-primary)] tracking-tight group-hover:text-indigo-500 transition-colors">
                              {user.name ?? t('users.guest')}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Hash size={10} className="text-slate-400" />
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                                {user.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label={t('common.email')}>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Mail size={14} className="text-slate-400" />
                          {user.email}
                        </div>
                      </td>
                      <td data-label={t('users.role')}>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'ADMIN' 
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {user.role === 'ADMIN' ? <Shield size={12} /> : <CheckCircle2 size={12} />}
                          {user.role}
                        </div>
                      </td>
                      <td data-label={t('users.joined')}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono uppercase">
                          <Calendar size={12} />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-[var(--border-color)]">
        <UserIcon size={16} className="text-slate-400" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
          {t('users.footer')}
        </p>
      </div>
    </div>
  );
}
