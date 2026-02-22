'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import {
  FiUser,
  FiMail,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiSave,
  FiPackage,
  FiArrowRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Connectez-vous
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Vous devez être connecté pour accéder à votre profil.
          </p>
          <Link href="/login">
            <Button size="lg">Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setEditing(false);
  };

  const menuItems = [
    {
      icon: FiShoppingBag,
      label: 'Mes commandes',
      description: 'Suivez vos commandes en cours',
      href: '/commandes',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: FiHeart,
      label: 'Mes favoris',
      description: 'Vos produits sauvegardés',
      href: '/boutique',
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      icon: FiSettings,
      label: 'Paramètres',
      description: 'Gérez votre compte',
      href: '/profil',
      color: 'text-gray-600',
      bg: 'bg-gray-100 dark:bg-gray-800',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Mon Profil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-lg shadow-primary-600/25">
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || '?'}
              </div>

              {editing ? (
                <div className="space-y-3 mb-4">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditing(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <FiSave className="w-4 h-4" />
                      {saving ? '...' : 'Sauver'}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {session.user?.name || 'Utilisateur'}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 inline-flex items-center gap-1"
                  >
                    <FiEdit2 className="w-3 h-3" />
                    Modifier
                  </button>
                </>
              )}

              <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mt-3">
                <FiMail className="w-4 h-4" />
                <p className="text-sm">{session.user?.email}</p>
              </div>

              {session.user?.role === 'ADMIN' && (
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                    <FiSettings className="w-3 h-3" />
                    Administrateur
                  </span>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full mb-3 gap-2">
                      <FiSettings className="w-4 h-4" />
                      Panel Admin
                    </Button>
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium text-sm"
                >
                  <FiLogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-2 space-y-4">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={item.href}>
                  <Card hover className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${item.bg}`}>
                          <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <FiArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}

          {/* Recent Activity (placeholder) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Activité récente
              </h3>
              <div className="text-center py-8 text-gray-400">
                <FiPackage className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Aucune activité récente</p>
                <p className="text-sm mt-1">Vos dernières activités apparaîtront ici</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
