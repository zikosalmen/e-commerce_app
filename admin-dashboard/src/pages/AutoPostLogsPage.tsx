import { useState } from 'react';
import { useAutoPostLogs, useUpdateLogStatus, type AutoPostLog } from '@/hooks/useAutoPost';
import { formatDate, formatPrice } from '@/lib/utils';
import { PageHeader, Badge, Button } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Terminal, RefreshCcw, Eye, CheckCircle, XCircle, Send, Ban, Calendar, Clock, Database } from 'lucide-react';

const STATUS_VARIANTS: Record<string, any> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  posted: 'indigo',
  cancelled: 'neutral',
};

function PreviewModal({ log, onClose }: { log: AutoPostLog; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-3xl overflow-hidden border border-[var(--border-color)] flex flex-col max-h-[80vh]"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">{t('autoPosting.actions.transmission')}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('autoPosting.actions.payloadSub')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <XCircle size={20} className="text-slate-400" />
          </button>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-950">
          <pre className="text-[13px] font-mono text-indigo-300 leading-relaxed">
            {JSON.stringify(log.webhook_payload, null, 2)}
          </pre>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button onClick={onClose} className="px-8 h-12">{t('autoPosting.logs.close')}</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AutoPostLogsPage() {
  const { t } = useTranslation();
  const { data: logs = [], isLoading, refetch } = useAutoPostLogs();
  const updateStatus = useUpdateLogStatus();
  const [preview, setPreview] = useState<AutoPostLog | null>(null);

  const headers = [
    t('autoPosting.logs.subject'),
    t('autoPosting.logs.protocol'),
    t('autoPosting.logs.schedule'),
    t('autoPosting.logs.timestamp'),
    t('autoPosting.logs.rawData'),
    t('autoPosting.logs.actions')
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <PageHeader
        title={t('autoPosting.telemetryTitle')}
        subtitle={t('autoPosting.telemetrySub')}
        action={
          <Button 
            variant="outline" 
            icon={<RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />} 
            onClick={() => refetch()}
            loading={isLoading}
          >
            {t('autoPosting.resync')}
          </Button>
        }
      />

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table responsive-table">
            <thead>
              <tr>
                {headers.map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-400">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <Terminal size={48} />
                        <p className="text-sm font-bold uppercase tracking-widest">{t('autoPosting.logs.noEntries')}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log: any) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={log.id} 
                      className="group"
                    >
                      <td data-label={t('autoPosting.logs.subject')}>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">
                            {log.product_name || t('autoPosting.logs.generic')}
                          </span>
                          {log.product_price != null && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {t('autoPosting.logs.value')}: {formatPrice(log.product_price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td data-label={t('autoPosting.logs.protocol')}>
                        <Badge variant={STATUS_VARIANTS[log.status] || 'neutral'}>
                          {log.status}
                        </Badge>
                      </td>
                      <td data-label={t('autoPosting.logs.schedule')}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <Clock size={12} className="text-slate-400" />
                          {log.scheduled_time ? formatDate(log.scheduled_time) : t('autoPosting.logs.realtime')}
                        </div>
                      </td>
                      <td data-label={t('autoPosting.logs.timestamp')}>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          <Calendar size={12} />
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td data-label={t('autoPosting.logs.rawData')}>
                        <button 
                          onClick={() => setPreview(log)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer border border-transparent hover:border-indigo-400"
                        >
                          {t('autoPosting.logs.accessJson')}
                        </button>
                      </td>
                      <td data-label={t('autoPosting.logs.actions')}>
                        <div className="flex gap-2">
                          {log.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateStatus.mutate({ id: log.id, status: 'approved' })}
                                className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                title={t('autoPosting.logs.approve')}
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => updateStatus.mutate({ id: log.id, status: 'rejected' })}
                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                title={t('autoPosting.logs.reject')}
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          {log.status === 'approved' && (
                            <button 
                              onClick={() => updateStatus.mutate({ id: log.id, status: 'posted' })}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                            >
                              <Send size={12} /> {t('autoPosting.logs.syncNow')}
                            </button>
                          )}
                          {!['pending', 'approved'].includes(log.status) && (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                              <Ban size={14} />
                            </div>
                          )}
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

      <AnimatePresence>
        {preview && <PreviewModal log={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}
