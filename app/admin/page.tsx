import { prisma } from '@/front/lib/prisma';
import { Card } from '@/components/ui/Card';
import { FiBox, FiShoppingBag, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { formatPrice } from '@/front/lib/utils';

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' },
    }),
  ]);

  const stats = [
    { name: 'Produits', value: productCount, icon: FiBox, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Commandes', value: orderCount, icon: FiShoppingBag, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Utilisateurs', value: userCount, icon: FiUsers, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Chiffre d\'affaires', value: formatPrice(totalRevenue._sum.total || 0), icon: FiTrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Bienvenue dans votre espace d'administration.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dernières commandes</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 font-semibold text-sm">Client</th>
                  <th className="px-6 py-4 font-semibold text-sm">Statut</th>
                  <th className="px-6 py-4 font-semibold text-sm">Total</th>
                  <th className="px-6 py-4 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium">{order.user.name}</p>
                        <p className="text-gray-500 text-xs">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Aucune commande récente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
