import { prisma } from '@/front/lib/prisma';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/front/lib/utils';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: FiClock },
  PAID: { label: 'Payée', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: FiCheckCircle },
  PROCESSING: { label: 'En traitement', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: FiPackage },
  SHIPPED: { label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: FiTruck },
  DELIVERED: { label: 'Livrée', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: FiCheckCircle },
  CANCELLED: { label: 'Annulée', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: FiXCircle },
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    paid: orders.filter((o) => o.status === 'PAID').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    revenue: orders
      .filter((o) => o.status === 'PAID' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des Commandes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Suivez et gérez toutes les commandes de vos clients.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total commandes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Payées</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.paid}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Chiffre d&apos;affaires</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{formatPrice(stats.revenue)}</p>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-sm">Commande</th>
                <th className="px-6 py-4 font-semibold text-sm">Client</th>
                <th className="px-6 py-4 font-semibold text-sm">Articles</th>
                <th className="px-6 py-4 font-semibold text-sm">Total</th>
                <th className="px-6 py-4 font-semibold text-sm">Statut</th>
                <th className="px-6 py-4 font-semibold text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.length > 0 ? (
                orders.map((order: any) => {
                  const status = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <p className="font-mono text-xs text-gray-500">#{order.id.substring(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item: any) => (
                            <p key={item.id} className="text-xs text-gray-600 dark:text-gray-400">
                              {item.quantity}x {item.product?.name || 'Produit supprimé'}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-400">+{order.items.length - 2} autre(s)</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <FiPackage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucune commande</p>
                    <p className="text-sm mt-1">Les commandes de vos clients apparaîtront ici.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
