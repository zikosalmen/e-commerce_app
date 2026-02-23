import { useState } from 'react';
import { useOrders, useUpdateOrderStatus, type Order } from '@/hooks/useOrders';
import { formatPrice, formatDate } from '@/lib/utils';
import { Pagination } from '@/components/shared/Pagination';
import { Badge, statusVariant, PageHeader, Button } from '@/components/ui';
import { X, Package, MapPin, User, ChevronRight, Hash, Calendar, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const statuses = ['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAGE_SIZE = 12;

export default function OrdersPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Order | null>(null);
  const { data, isLoading } = useOrders({ status, page, pageSize: PAGE_SIZE });
  const updateStatus = useUpdateOrderStatus();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('orders.title')}
        subtitle={`${data?.total ?? 0} ${t('orders.subtitle')}`}
      />

      {/* Status filter chips */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border-none shadow-sm ${
              status === s
                ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table responsive-table">
            <thead>
              <tr>
                {[t('orders.reference'), t('orders.customerIdentification'), t('orders.currentStatus'), t('orders.revenue'), t('orders.purchaseDate'), t('orders.action')].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skel-${i}`}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className="skeleton h-4 w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  data?.orders.map((order: Order) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={order.id} 
                      className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30" 
                      onClick={() => setDetail(order)}
                    >
                      <td data-label={t('orders.reference')}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-mono text-[10px] font-bold group-hover:text-indigo-500 transition-colors">
                            <Hash size={14} />
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-indigo-500">#{order.id.slice(-8).toUpperCase()}</span>
                            <p className="text-[10px] text-slate-400 font-medium">{t('orders.clickForDetails')}</p>
                          </div>
                        </div>
                      </td>
                      <td data-label={t('dashboard.customer')}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                            {(order.user?.name ?? order.user?.email ?? 'G')[0]}
                          </div>
                          <span className="text-sm font-bold text-[var(--text-primary)]">
                            {order.user?.name ?? order.user?.email?.split('@')[0] ?? 'Guest User'}
                          </span>
                        </div>
                      </td>
                      <td data-label={t('common.status')}>
                        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                      </td>
                      <td data-label="Total">
                        <span className="font-black text-slate-900 dark:text-white">{formatPrice(order.total)}</span>
                      </td>
                      <td data-label={t('common.date')}>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td data-label={t('common.actions')} onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                        >
                          {statuses.filter(s => s !== 'ALL').map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
              {!isLoading && (!data?.orders || data.orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="text-center py-24">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <ShoppingBag size={48} />
                      <p className="font-bold text-sm tracking-widest uppercase">{t('orders.noOrders')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {data && (
          <div className="border-t border-[var(--border-color)] bg-slate-50/30 dark:bg-slate-800/20">
            <Pagination page={page} total={data.total} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {detail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                    <Hash size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight uppercase">{t('orders.details.title')} #{detail.id.slice(-10).toUpperCase()}</h3>
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">{formatDate(detail.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{t('orders.details.customerDetails')}</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                        <User size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{detail.user?.name ?? 'Guest User'}</p>
                        <p className="text-xs font-medium text-slate-400 truncate">{detail.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{t('orders.details.shippingVector')}</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-start gap-4 h-full">
                      <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed text-slate-600 dark:text-slate-300">
                        {detail.shippingAddress || t('orders.details.noAddress')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                    <Package size={14} /> {t('orders.details.manifestItems')}
                  </h4>
                  <div className="space-y-3">
                    {detail.items?.map((item: any) => (
                      <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                            {item.product?.imageUrl && (
                              <img src={item.product?.imageUrl} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold group-hover:text-indigo-500 transition-colors line-clamp-1">{item.product?.name ?? 'Product'}</p>
                            <p className="text-xs font-bold text-slate-400">{t('orders.details.qty')}: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="p-6 rounded-[24px] bg-slate-900 text-white space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>{t('orders.details.subtotal')}</span>
                    <span>{formatPrice(detail.total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400 pb-4 border-b border-white/10">
                    <span>{t('orders.details.shippingEstimate')}</span>
                    <span className="text-emerald-400 uppercase">{t('orders.details.shippingFree')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black tracking-tight">{t('orders.details.totalPayment')}</span>
                    <span className="text-2xl font-black text-indigo-400">{formatPrice(detail.total)}</span>
                  </div>
                </div>
              </div>

              {/* Modal actions */}
              <div className="p-8 pt-0 shrink-0">
                <Button className="w-full h-14 bg-indigo-600 text-lg shadow-xl shadow-indigo-500/20" onClick={() => setDetail(null)}>
                  {t('orders.details.acknowledge')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
