import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutoPostSettings, useSaveAutoPostSettings, type AutoPostSettings } from '@/hooks/useAutoPost';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { Button, PageHeader } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Bot, 
  Settings2, 
  History, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Mail, 
  AlignLeft,
  ChevronRight,
  Database
} from 'lucide-react';

const DEFAULT_SETTINGS: AutoPostSettings = {
  is_active: false,
  source_type: 'random',
  product_id: null,
  category_id: null,
  only_promo: false,
  frequency_type: 'interval',
  interval_hours: 24,
  posts_per_day: null,
  scheduled_times: [],
  require_email_confirmation: false,
  global_text: '',
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

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 pb-6 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0">
      <div className="sm:w-64 shrink-0">
        <label className="text-sm font-bold text-[var(--text-primary)] block mb-1">
          {label}
        </label>
        {hint && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">{hint}</p>}
      </div>
      <div className="flex-1 w-full">{children}</div>
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

export default function AutoPostingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: existing, isLoading: settingsLoading } = useAutoPostSettings();
  const saveMutation = useSaveAutoPostSettings();
  const { data: catData } = useCategories();
  const { data: prodData } = useProducts();

  const [form, setForm] = useState<AutoPostSettings>(DEFAULT_SETTINGS);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({ 
        ...DEFAULT_SETTINGS, 
        ...existing,
        frequency_type: 'interval',
        posts_per_day: null
      });
    }
  }, [existing]);

  const set = <K extends keyof AutoPostSettings>(key: K, value: AutoPostSettings[K]) => {
    setForm((prev: AutoPostSettings) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveMutation.mutate(form, {
      onSuccess: () => setShowPreview(false),
    });
  };

  const categories = catData ?? [];
  const products = (prodData?.products ?? []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat(t('i18n.locale', { defaultValue: 'fr-FR' }), {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-20 w-1/3 mb-10" />
        <div className="skeleton h-60 w-full" />
        <div className="skeleton h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <PageHeader
        title={t('autoPosting.title')}
        subtitle={t('autoPosting.subtitle')}
        action={
          <Button 
            variant="secondary" 
            icon={<History size={18} />} 
            onClick={() => navigate('/admin/auto-posting/logs')}
          >
            {t('autoPosting.executionLogs')}
          </Button>
        }
      />

      {/* Activation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-1 rounded-[20px] transition-all duration-500 ${form.is_active ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-slate-200 dark:bg-slate-800'}`}
      >
        <div className="bg-white dark:bg-slate-900 rounded-[19px] p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${form.is_active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 rotate-12' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Bot size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">{t('autoPosting.status.title')}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {form.is_active ? t('autoPosting.status.live') : t('autoPosting.status.standby')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-black uppercase tracking-widest hidden sm:block ${form.is_active ? 'text-indigo-500' : 'text-slate-400'}`}>
              {form.is_active ? t('autoPosting.status.online') : t('autoPosting.status.offline')}
            </span>
            <CustomToggle checked={form.is_active} onChange={v => set('is_active', v)} />
          </div>
        </div>
      </motion.div>

      {/* 2. Product Source */}
      <Section title={t('autoPosting.content.title')} icon={Database}>
        <Row label={t('autoPosting.content.method')} hint={t('autoPosting.content.methodHint')}>
          <select 
            value={form.source_type} 
            onChange={v => set('source_type', v.target.value as any)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
          >
            <option value="random">{t('autoPosting.content.random')}</option>
            <option value="product">{t('autoPosting.content.product')}</option>
            <option value="category">{t('autoPosting.content.category')}</option>
          </select>
        </Row>

        <AnimatePresence mode="wait">
          {form.source_type === 'product' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Row label={t('autoPosting.content.targetProduct')} hint={t('autoPosting.content.targetProductHint')}>
                <select 
                  value={form.product_id ?? ''} 
                  onChange={v => set('product_id', v.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold outline-none"
                >
                  <option value="">{t('autoPosting.content.selectProduct')}</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.price)})</option>
                  ))}
                </select>
              </Row>
            </motion.div>
          )}

          {form.source_type === 'category' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Row label={t('autoPosting.content.targetCategory')} hint={t('autoPosting.content.targetCategoryHint')}>
                <select 
                  value={form.category_id ?? ''} 
                  onChange={v => set('category_id', v.target.value || null)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold outline-none"
                >
                  <option value="">{t('autoPosting.content.selectCategory')}</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Row>
            </motion.div>
          )}
        </AnimatePresence>

        <Row label={t('autoPosting.content.promoOnly')} hint={t('autoPosting.content.promoOnlyHint')}>
          <CustomToggle checked={form.only_promo} onChange={v => set('only_promo', v)} />
        </Row>
      </Section>

      {/* 3. Scheduling */}
      <Section title={t('autoPosting.scheduling.title')} icon={Clock}>
        <Row label={t('autoPosting.scheduling.intervalDelay')} hint={t('autoPosting.scheduling.intervalHint')}>
          <div className="relative group">
            <input
              type="number" 
              value={form.interval_hours ?? 24}
              onChange={v => set('interval_hours', parseInt(v.target.value) || null)}
              className="w-full pl-4 pr-16 py-3 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-400 group-focus-within:text-indigo-500">{t('autoPosting.scheduling.hours')}</span>
          </div>
        </Row>

        
      </Section>

      {/* 4. Confirmation & Text */}
      <Section title={t('autoPosting.governance.title')} icon={Settings2}>
        <Row label={t('autoPosting.governance.humanLoop')} hint={t('autoPosting.governance.humanLoopHint')}>
          <div className="flex items-center gap-4">
            <CustomToggle checked={form.require_email_confirmation} onChange={v => set('require_email_confirmation', v)} />
            <div className={`p-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${form.require_email_confirmation ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              {form.require_email_confirmation ? t('autoPosting.governance.semiAuto') : t('autoPosting.governance.fullAuto')}
            </div>
          </div>
        </Row>
        <Row label={t('autoPosting.governance.globalText')} hint={t('autoPosting.governance.globalTextHint')}>
          <div className="relative group">
            <AlignLeft size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500" />
            <textarea
              value={form.global_text}
              onChange={e => set('global_text', e.target.value)}
              placeholder={t('autoPosting.governance.placeholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-medium min-h-[120px] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </Row>
      </Section>

      {/* Final Actions */}
      <div className="flex items-center justify-between p-6 bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${form.is_active ? 'bg-indigo-500' : 'bg-slate-600'}`} />
          <span className="text-sm font-bold text-white tracking-tight">{t('autoPosting.actions.ready')}</span>
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
            className="bg-indigo-600 shadow-indigo-500/40" 
            loading={saveMutation.isPending}
            onClick={handleSave}
            icon={<CheckCircle2 size={18} />}
          >
            {t('autoPosting.actions.deploy')}
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
                    {JSON.stringify({ trigger: 'settings_sync', payload: form }, null, 2)}
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
