import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories, type Category } from '@/hooks/useCategories';
import { slugify } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Upload, X, ImageIcon, Info, Target, Layers, Layout, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button, PageHeader } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ProductEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { data: existingProduct, isLoading: loadingProduct } = useProduct(isNew ? undefined : id);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: 0,
    comparePrice: null as number | null, stock: 0,
    categoryId: '', featured: false, isActive: true, imageUrl: '', images: '[]',
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name, slug: existingProduct.slug,
        description: existingProduct.description, price: existingProduct.price,
        comparePrice: existingProduct.comparePrice, stock: existingProduct.stock,
        categoryId: existingProduct.categoryId, featured: existingProduct.featured,
        isActive: existingProduct.isActive,
        imageUrl: existingProduct.imageUrl ?? '', images: existingProduct.images ?? '[]',
      });
    }
  }, [existingProduct]);

  const handleNameChange = (name: string) => {
    setForm((p) => ({ ...p, name, slug: isNew ? slugify(name) : p.slug }));
  };

  const CACHE_KEY = 'product_image_cache';
  const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

  const hashFile = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  };

  const getCacheEntry = (hash: string): string | null => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const cache = JSON.parse(raw);
      const entry = cache[hash];
      if (!entry || Date.now() - entry.ts > CACHE_TTL) return null;
      return entry.url;
    } catch { return null; }
  };

  const setCacheEntry = (hash: string, url: string) => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const cache = raw ? JSON.parse(raw) : {};
      cache[hash] = { url, ts: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch { }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    try {
      const hash = await hashFile(file);
      const cached = getCacheEntry(hash);
      let publicUrl: string;
      if (cached) {
        publicUrl = cached;
        toast.success(t('common.success'));
      } else {
        const ext = file.name.split('.').pop();
        const fname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('products').upload(`products/${fname}`, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(`products/${fname}`);
        publicUrl = urlData.publicUrl;
        setCacheEntry(hash, publicUrl);
        toast.success(t('common.success'));
      }
      const imgs: string[] = JSON.parse(form.images || '[]');
      if (!imgs.includes(publicUrl)) imgs.push(publicUrl);
      setForm((p) => ({ ...p, imageUrl: p.imageUrl || publicUrl, images: JSON.stringify(imgs) }));
    } catch (err: any) {
      toast.error(err.message || t('common.error'));
    } finally { setUploading(false); }
  };

  const removeImage = (url: string) => {
    const imgs: string[] = JSON.parse(form.images || '[]').filter((u: string) => u !== url);
    setForm((p) => ({ ...p, images: JSON.stringify(imgs), imageUrl: p.imageUrl === url ? (imgs[0] ?? '') : p.imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, slug: form.slug, description: form.description,
      price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: Number(form.stock), categoryId: form.categoryId, featured: form.featured,
      isActive: form.isActive,
      imageUrl: form.imageUrl || null, images: form.images,
    };
    try {
      if (isNew) await createProduct.mutateAsync(payload);
      else await updateProduct.mutateAsync({ id: id!, ...payload });
      navigate('/admin/products');
    } catch { }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;
  if (!isNew && loadingProduct) return <div className="p-20 text-center"><div className="skeleton mx-auto h-[500px] w-full max-w-2xl rounded-3xl" /></div>;

  const images: string[] = JSON.parse(form.images || '[]');

  return (
    <div className="max-w-5xl space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/products')} 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-[var(--border-color)] text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all cursor-pointer"
          title={t('common.back')}
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader 
          title={isNew ? t('products.edit.registerTitle') : t('products.edit.modifyTitle')} 
          subtitle={isNew ? t('products.edit.initializeSub') : `${t('products.edit.technicalId')}: ${id?.toUpperCase()}`} 
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Base Info */}
          <section className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Info size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{t('products.edit.identityDetails')}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.nomenclature')} *</label>
                <input 
                  type="text" 
                  required 
                  value={form.name} 
                  onChange={(e) => handleNameChange(e.target.value)} 
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.technicalSlug')} *</label>
                <input 
                  type="text" 
                  required 
                  value={form.slug} 
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} 
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.technicalSpecs')} *</label>
              <textarea 
                required 
                value={form.description} 
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
                rows={6} 
                className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                placeholder={t('products.edit.specsPlaceholder')}
              />
            </div>
          </section>

          {/* Logistics & Pricing */}
          <section className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Target size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{t('products.edit.logisticsValuations')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.valuation')} (€) *</label>
                <input 
                  type="number" 
                  required 
                  step="0.01" 
                  min="0" 
                  value={form.price} 
                  onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))} 
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-black focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.referenceBase')} (€)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  value={form.comparePrice ?? ''} 
                  onChange={(e) => setForm((p) => ({ ...p, comparePrice: e.target.value ? parseFloat(e.target.value) : null }))} 
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.activeInventory')} *</label>
                <input 
                  type="number" 
                  required 
                  min="0" 
                  value={form.stock} 
                  onChange={(e) => setForm((p) => ({ ...p, stock: parseInt(e.target.value) || 0 }))} 
                  className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-black text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Assets */}
          <section className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Layout size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{t('products.edit.visualAssets')}</h3>
            </div>

            <div className="flex flex-wrap gap-4">
              <AnimatePresence mode="popLayout">
                {images.map((url) => (
                  <motion.div 
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    key={url} 
                    className={`relative w-28 h-28 rounded-2xl overflow-hidden border-2 transition-all ${form.imageUrl === url ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105 z-10' : 'border-slate-100 dark:border-slate-800'}`}
                    onClick={() => setForm(p => ({ ...p, imageUrl: url }))}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover cursor-pointer" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(url); }} 
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-950/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    {form.imageUrl === url && (
                      <div className="absolute inset-x-0 bottom-0 bg-indigo-500 text-[8px] font-black uppercase text-center py-1 text-white">{t('products.edit.main')}</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <label 
                className={`w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all group cursor-pointer ${uploading ? 'bg-slate-50 border-indigo-200 animate-pulse' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/30'}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Upload size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500">
                  {uploading ? t('products.edit.processing') : t('products.edit.addPost')}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1 block mb-2">{t('products.edit.remoteAsset')}</label>
              <div className="relative group">
                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
                <input 
                  type="url" 
                  value={form.imageUrl} 
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} 
                  className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                  placeholder={t('products.edit.insertExternal')}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <section className="card-premium p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Layers size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{t('products.edit.taxonomy')}</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('products.edit.classification')} *</label>
              <select 
                required 
                value={form.categoryId} 
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} 
                className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="">{t('products.edit.awaiting')}</option>
                {categories?.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-800/20 cursor-pointer group transition-all hover:border-amber-500/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${form.featured ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('products.edit.featured')}</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.featured} 
                  onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} 
                  className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 focus:ring-amber-500/20 transition-all accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-800/20 cursor-pointer group transition-all hover:border-emerald-500/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${form.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {form.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('products.edit.published')}</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.isActive} 
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} 
                  className="w-5 h-5 rounded-md border-2 border-slate-300 text-emerald-500 focus:ring-emerald-500/20 transition-all accent-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <Button 
              type="submit" 
              disabled={isSaving} 
              loading={isSaving}
              icon={<Save size={18} />}
              className="w-full h-16 bg-indigo-600 shadow-xl shadow-indigo-500/20 text-base flex-row-reverse"
            >
              {isNew ? t('products.edit.initializeAsset') : t('products.edit.synchronizeChanges')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/products')} 
              className="w-full h-14"
            >
              {t('common.cancel')}
            </Button>
          </section>
        </div>
      </form>
    </div>
  );
}
