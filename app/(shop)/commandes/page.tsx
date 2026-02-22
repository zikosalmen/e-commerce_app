'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/front/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiShoppingBag,
  FiArrowLeft,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: FiClock },
  PAID: { label: 'Payée', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: FiCheckCircle },
  PROCESSING: { label: 'En traitement', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: FiPackage },
  SHIPPED: { label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: FiTruck },
  DELIVERED: { label: 'Livrée', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: FiCheckCircle },
  CANCELLED: { label: 'Annulée', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: FiXCircle },
};

interface OrderData {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      slug: string;
    };
  }[];
}

export default function OrdersPage() {
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!session) return;
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchOrders();
    } else if (authStatus !== 'loading') {
      setLoading(false);
    }
  }, [session, authStatus]);

  if (authStatus === 'loading' || loading) {
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
            <FiShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Connectez-vous
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Vous devez être connecté pour voir vos commandes.
          </p>
          <Link href="/login">
            <Button size="lg">Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profil" className="text-gray-500 hover:text-primary-600 transition-colors">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes Commandes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Suivez l&apos;état de vos commandes
          </p>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        Commande #{order.id.substring(0, 12)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} self-start`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{item.quantity}×</span>
                          <Link
                            href={`/produit/${item.product.slug}`}
                            className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Aucune commande
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Vous n&apos;avez pas encore passé de commande.
          </p>
          <Link href="/boutique">
            <Button size="lg" className="gap-2">
              <FiShoppingBag className="w-5 h-5" />
              Découvrir la boutique
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
