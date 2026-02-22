import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, type Category, type CategoryFormData } from '@/hooks/useCategories';
import { slugify, formatDate } from '@/lib/utils';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Button, PageHeader, Badge } from '@/components/ui';
import { Plus, Pencil, Trash2, X, ImageIcon, AlertTriangle, Layers, Hash, Calendar, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>({ name: '', slug: '', description: '', image: '' });

  const openNew = () => { 
    setEditing(null); 
    setForm({ name: '', slug: '', description: '', image: '' }); 
    setFormOpen(true); 
  };
  
  const openEdit = (cat: Category) => { 
    setEditing(cat); 
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', image: cat.image ?? '' }); 
    setFormOpen(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await updateCategory.mutateAsync({ id: editing.id, ...form });
      else await createCategory.mutateAsync(form);
      setFormOpen(false);
    } catch { /* handled */ }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if ((deleteTarget.productCount ?? 0) > 0) {
      toast.error(t('categories.deleteConfirm'));
      setDeleteTarget(null);
      return;
    }
    deleteCategory.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('categories.title')}
        subtitle={`${categories?.length ?? 0} ${t('categories.subtitle')}`}
        action={
          <Button icon={<Plus size={18} />} onClick={openNew}>
            {t('categories.addNew')}
          </Button>
        }
      />

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table responsive-table">
            <thead>
              <tr>
                {[t('categories.name'), t('categories.slug'), t('categories.products'), t('common.date'), t('common.actions')].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  categories?.map((cat: Category) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={cat.id} 
                      className="group"
                    >
                      <td data-label={t('common.category')}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                              <Layers size={20} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-black text-[var(--text-primary)] tracking-tight group-hover:text-indigo-500 transition-colors">
                              {cat.name}
                            </span>
                            {cat.description && (
                              <p className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-[200px]">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td data-label={t('categories.slug')}>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Hash size={12} />
                          {cat.slug}
                        </div>
                      </td>
                      <td data-label={t('categories.products')}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black">
                          <ShoppingBag size={12} />
                          {cat.productCount}
                        </div>
                      </td>
                      <td data-label={t('common.date')}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Calendar size={12} />
                          {formatDate(cat.createdAt)}
                        </div>
                      </td>
                      <td data-label={t('common.actions')}>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(cat)} 
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer"
                            title={t('common.edit')}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                              (cat.productCount ?? 0) > 0 
                                ? 'bg-slate-100 dark:bg-slate-900 border-transparent text-slate-300 cursor-not-allowed' 
                                : 'bg-slate-50 dark:bg-slate-800 border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50'
                            }`}
                            title={t('common.delete')}
                          >
                            {(cat.productCount ?? 0) > 0 ? <AlertTriangle size={16} /> : <Trash2 size={16} />}
                          </button>
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

      {/* Slide-over Form */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setFormOpen(false)} 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-3xl flex flex-col h-full"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black tracking-tight">{editing ? t('categories.updateTitle') : t('categories.createTitle')}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('common.category')}</p>
                </div>
                <button onClick={() => setFormOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('categories.name')}</label>
                    <input 
                      type="text" 
                      required 
                      value={form.name} 
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: editing ? p.slug : slugify(e.target.value) }))} 
                      className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('categories.slug')}</label>
                    <input 
                      type="text" 
                      required 
                      value={form.slug} 
                      onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} 
                      className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">{t('common.description')}</label>
                    <textarea 
                      value={form.description ?? ''} 
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
                      rows={4} 
                      className="w-full px-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1">Image URL</label>
                    <div className="relative group">
                      <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
                      <input 
                        type="url" 
                        value={form.image ?? ''} 
                        onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} 
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex gap-4">
                <Button variant="outline" className="flex-1 h-14" onClick={() => setFormOpen(false)}>{t('common.cancel')}</Button>
                <Button type="submit" form="category-form" className="flex-1 h-14 bg-indigo-600 shadow-lg shadow-indigo-500/20" loading={createCategory.isPending || updateCategory.isPending}>
                  {editing ? t('common.save') : t('common.create')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteTarget}
        title={t('categories.deleteTitle')}
        message={
          deleteTarget && (deleteTarget.productCount ?? 0) > 0
            ? t('categories.deleteConfirm')
            : `${t('categories.deleteConfirm')} ("${deleteTarget?.name}")`
        }
        confirmLabel={t('common.confirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
