import { useDashboardStats } from '@/hooks/useDashboard';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, Tags, ShoppingCart, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Badge, statusVariant, PageHeader } from '@/components/ui';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboardStats();
  const navigate = useNavigate();

  const stats = [
    { label: t('dashboard.totalProducts'), value: data?.totalProducts ?? 0, icon: Package, color: '#6366F1', bg: 'rgba(99,102,241,0.1)', link: '/admin/products' },
    { label: t('dashboard.activeCategories'), value: data?.totalCategories ?? 0, icon: Tags,    color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', link: '/admin/categories' },
    { label: t('dashboard.totalOrders'),   value: data?.totalOrders ?? 0, icon: ShoppingCart, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', link: '/admin/orders' },
    { label: t('dashboard.totalRevenue'), value: formatPrice(data?.totalRevenue ?? 0), icon: DollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title={t('dashboard.title')} 
        subtitle={t('dashboard.subtitle')} 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <StatCard key={s.label} {...s} isLoading={isLoading} />
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 card-premium overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <TrendingUp size={18} />
              </div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">{t('dashboard.recentOrders')}</h2>
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              {t('dashboard.viewReport')}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table responsive-table">
              <thead>
                <tr>
                  {[t('dashboard.orderId'), t('dashboard.customer'), t('common.status'), t('common.revenue'), t('common.date')].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j}><div className="skeleton h-4 w-4/5" /></td>
                        ))}
                      </tr>
                    ))
                  : data?.recentOrders.map((order: any) => (
                      <tr key={order.id} className="group">
                        <td data-label={t('dashboard.orderId')} className="font-mono text-[10px] font-bold text-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5 px-2 py-1 rounded inline-block m-4">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td data-label={t('dashboard.customer')} className="font-semibold text-slate-700 dark:text-slate-200">
                          {order.user?.name ?? order.user?.email?.split('@')[0] ?? 'Guest'}
                        </td>
                        <td data-label={t('common.status')}>
                          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                        </td>
                        <td data-label={t('common.revenue')} className="font-black text-slate-900 dark:text-white">
                          {formatPrice(order.total)}
                        </td>
                        <td data-label={t('common.date')} className="text-xs text-slate-400 font-medium">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                {!isLoading && (!data?.recentOrders || data.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                        <ShoppingCart size={40} />
                        <p className="text-sm font-medium">{t('dashboard.noOrders')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions or Analytics Placeholder */}
        <div className="space-y-6">
          <div className="card-premium p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-indigo-500/20">
            <h3 className="text-lg font-bold mb-2">{t('dashboard.helpTitle')}</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              {t('dashboard.helpDesc')}
            </p>
            <button 
              onClick={() => navigate('/admin/auto-posting')}
              className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              {t('dashboard.exploreAuto')}
            </button>
          </div>
          
          <div className="card-premium p-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">{t('dashboard.quickStats')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t('dashboard.invHealth')}</span>
                <span className="text-sm font-bold text-emerald-500">{t('dashboard.statusGood')}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{t('dashboard.srvStatus')}</span>
                <span className="text-sm font-bold text-emerald-500">{t('dashboard.statusActive')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
