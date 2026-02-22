import { auth } from '@/front/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Produits', href: '/admin/produits', icon: FiBox },
    { name: 'Commandes', href: '/admin/commandes', icon: FiShoppingBag },
    { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: FiUsers },
    { name: 'Paramètres', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              E-Shop Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium group"
            >
              <link.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/api/auth/signout"
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header for Mobile */}
        <header className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">Admin</span>
          </Link>
          {/* Mobile menu toggle could be added here */}
        </header>

        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
