import { prisma } from '@/front/lib/prisma';
import { Card } from '@/components/ui/Card';
import { FiUser, FiShield, FiMail, FiCalendar } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          orders: true,
          cartItems: true,
        },
      },
    },
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    users: users.filter((u) => u.role === 'USER').length,
    recentWeek: users.filter(
      (u) => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Gérez les comptes utilisateurs et les rôles.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiUser className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiShield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.admins}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiUser className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.users}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiCalendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cette semaine</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentWeek}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-sm">Utilisateur</th>
                <th className="px-6 py-4 font-semibold text-sm">Email</th>
                <th className="px-6 py-4 font-semibold text-sm">Rôle</th>
                <th className="px-6 py-4 font-semibold text-sm">Commandes</th>
                <th className="px-6 py-4 font-semibold text-sm">Panier</th>
                <th className="px-6 py-4 font-semibold text-sm">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-sm">
                        {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name || 'Sans nom'}
                        </p>
                        <p className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FiMail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {user.role === 'ADMIN' && <FiShield className="w-3 h-3" />}
                      {user.role === 'ADMIN' ? 'Administrateur' : 'Client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user._count.orders}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user._count.cartItems} articles
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <FiUser className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun utilisateur</p>
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
