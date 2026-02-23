import { useState } from 'react';
import { useProducts, useDeleteProduct, type Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { SearchInput } from '@/components/shared/SearchInput';
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Button, PageHeader } from '@/components/ui';
import { formatPrice, formatDate, truncate } from '@/lib/utils';
import { Plus, Pencil, Trash2, Star, ImageIcon, Filter, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useProducts({
    search,
    categoryId: categoryFilter || undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    if (deleteTarget) {
      deleteProduct.mutate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: t('products.outOfStock'), color: 'text-red-500', bg: 'bg-red-500/10' };
    if (stock <= 10) return { label: t('products.lowStock'), color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: t('products.inStock'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('products.title')}
        subtitle={`${data?.total ?? 0} ${t('products.subtitle')}`}
        action={
          <Button icon={<Plus size={18} />} onClick={() => navigate('/admin/products/new')}>
            {t('products.addNew')}
          </Button>
        }
      />

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={(val: string) => { setSearch(val); setPage(1); }}
            placeholder={t('products.searchPlaceholder')}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">{t('products.allCategories')}</option>
              {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table responsive-table">
            <thead>
              <tr>
                {[t('products.details'), t('common.category'), t('common.price'), t('common.stock'), t('common.status'), t('common.actions')].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  data?.products.map((product: Product) => {
                    const stock = getStockStatus(product.stock);
                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={product.id}
                        className="group"
                      >
                        <td data-label={t('common.name')}>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={20} className="text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[var(--text-primary)] truncate transition-colors group-hover:text-indigo-500">
                                {truncate(product.name, 40)}
                              </p>
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5">
                                {t('products.sku')}: {product.id.slice(0, 8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td data-label={t('common.category')}>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] text-xs font-semibold">
                            <Layers size={12} />
                            {product.category?.name ?? 'Uncategorized'}
                          </div>
                        </td>
                        <td data-label={t('common.price')}>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                            {product.comparePrice && (
                              <span className="text-[10px] text-slate-400 line-through font-medium">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td data-label={t('common.stock')}>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              <span>{t('products.quantity')}</span>
                              <span className={stock.color}>{product.stock}</span>
                            </div>
                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                className={`h-full rounded-full ${stock.bg.replace('/10', '')}`} 
                              />
                            </div>
                          </div>
                        </td>
                        <td data-label={t('common.status')}>
                          <div className="flex items-center gap-2">
                            {product.featured && (
                              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500" title="Featured Product">
                                <Star size={14} className="fill-amber-500" />
                              </div>
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${stock.bg} ${stock.color}`}>
                              {stock.label}
                            </span>
                          </div>
                        </td>
                        <td data-label={t('common.actions')}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/products/${product.id}`)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer"
                              title={t('common.edit')}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(product)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all cursor-pointer"
                              title={t('common.delete')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {data && (
          <div className="border-t border-[var(--border-color)] bg-slate-50/30 dark:bg-slate-800/20">
            <Pagination page={page} total={data.total} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title={t('products.archiveTitle')}
        message={t('products.archiveConfirm', { name: deleteTarget?.name })}
        confirmLabel={t('products.archiveTitle')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
