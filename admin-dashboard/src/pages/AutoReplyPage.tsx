import { useState, useEffect } from 'react';
import { useAutoReplySettings, useSaveAutoReplySettings, type AutoReplySettings } from '@/hooks/useAutoReply';
import { Button, PageHeader } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquareShare, 
  Settings2, 
  CheckCircle2, 
  Eye, 
  Database,
  Facebook,
  Instagram,
  MessageCircle,
  Hash
} from 'lucide-react';

const DEFAULT_SETTINGS: AutoReplySettings = {
  is_active: false,
  fetch_fb_messages: true,
  fetch_ig_messages: true,
  fetch_fb_comments: true,
  fetch_ig_comments: true,
};

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <Icon size={20} />
        </div>
        <h2 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
}

function Row({ label, hint, icon: Icon, children }: { label: string; hint?: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 pb-6 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0">
      <div className="sm:w-64 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={14} className="text-indigo-500" />}
          <label className="text-sm font-bold text-[var(--text-primary)] block">
            {label}
          </label>
        </div>
        {hint && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">{hint}</p>}
      </div>
      <div className="flex-1 w-full flex justify-end">
        {children}
      </div>
    </div>
  );
}

function CustomToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer
        ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}
      `}
    >
      <motion.span
        animate={{ x: checked ? 26 : 4 }}
        className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

export default function AutoReplyPage() {
  const { t } = useTranslation();
  const { data: existing, isLoading: settingsLoading } = useAutoReplySettings();
  const saveMutation = useSaveAutoReplySettings();

  const [form, setForm] = useState<AutoReplySettings>(DEFAULT_SETTINGS);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (existing) setForm({ ...DEFAULT_SETTINGS, ...existing });
  }, [existing]);

  const set = <K extends keyof AutoReplySettings>(key: K, value: AutoReplySettings[K]) => {
    setForm((prev: AutoReplySettings) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveMutation.mutate(form, {
      onSuccess: () => setShowPreview(false),
    });
  };

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-20 w-1/3 mb-10" />
        <div className="skeleton h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <PageHeader
        title={t('autoReply.title')}
        subtitle={t('autoReply.subtitle')}
      />

      {/* Activation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-1 rounded-[20px] transition-all duration-500 ${form.is_active ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
      >
        <div className="bg-white dark:bg-slate-900 rounded-[19px] p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${form.is_active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 rotate-12' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <MessageSquareShare size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{t('autoReply.status.title')}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {form.is_active ? t('autoReply.status.active') : t('autoReply.status.inactive')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-black uppercase tracking-widest hidden sm:block ${form.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
              {form.is_active ? t('autoReply.status.online') : t('autoReply.status.offline')}
            </span>
            <CustomToggle checked={form.is_active} onChange={v => set('is_active', v)} />
          </div>
        </div>
      </motion.div>

      {/* Configuration Section */}
      <Section title={t('autoReply.fetcher.title')} icon={Settings2}>
        <Row 
          label={t('autoReply.fetcher.fbMessages')} 
          hint="Messenger direct communication" 
          icon={Facebook}
        >
          <CustomToggle checked={form.fetch_fb_messages} onChange={v => set('fetch_fb_messages', v)} />
        </Row>
        
        <Row 
          label={t('autoReply.fetcher.igMessages')} 
          hint="Direct messages from Instagram" 
          icon={Instagram}
        >
          <CustomToggle checked={form.fetch_ig_messages} onChange={v => set('fetch_ig_messages', v)} />
        </Row>

        <Row 
          label={t('autoReply.fetcher.fbComments')} 
          hint="Public interaction on posts" 
          icon={MessageCircle}
        >
          <CustomToggle checked={form.fetch_fb_comments} onChange={v => set('fetch_fb_comments', v)} />
        </Row>

        <Row 
          label={t('autoReply.fetcher.igComments')} 
          hint="Media commentary stream" 
          icon={Hash}
        >
          <CustomToggle checked={form.fetch_ig_comments} onChange={v => set('fetch_ig_comments', v)} />
        </Row>
      </Section>

      {/* Final Actions */}
      <div className="flex items-center justify-between p-6 bg-slate-900 rounded-3xl shadow-2xl shadow-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${form.is_active ? 'bg-emerald-500' : 'bg-slate-600'}`} />
          <span className="text-sm font-bold text-white tracking-tight">{t('autoReply.actions.ready')}</span>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10" 
            icon={<Eye size={18} />}
            onClick={() => setShowPreview(true)}
          >
            {t('autoPosting.actions.review')}
          </Button>
          <Button 
            className="bg-emerald-600 shadow-emerald-500/40" 
            loading={saveMutation.isPending}
            onClick={handleSave}
            icon={<CheckCircle2 size={18} />}
          >
            {t('autoReply.actions.deploy')}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreview(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-3xl overflow-hidden"
            >
              <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Database size={20} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{t('autoPosting.actions.payloadTitle')}</h3>
                </div>
                <div className="bg-slate-950 rounded-2xl p-6 overflow-auto max-h-[400px] custom-scrollbar">
                  <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                    {JSON.stringify({ trigger: 'auto_reply_sync', payload: form }, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="p-8 pt-4 flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>{t('autoPosting.actions.dismiss')}</Button>
                <Button className="flex-1" loading={saveMutation.isPending} onClick={handleSave}>{t('autoPosting.actions.syncReload')}</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
