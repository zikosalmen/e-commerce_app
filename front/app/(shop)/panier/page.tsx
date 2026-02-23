'use client';

import { useCart } from '@/lib/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Il semble que vous n'ayez pas encore ajouté de produits à votre panier.
          </p>
          <Link href="/boutique">
            <Button size="lg" className="w-full sm:w-auto">
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/boutique" className="text-gray-500 hover:text-primary-600 transition-colors">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon Panier ({totalItems})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(JSON.parse(item.images)[0] || item.imageUrl)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/produit/${item.slug}`}>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Réf: {item.id.substring(0, 8)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:text-primary-600 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:text-primary-600 transition-colors disabled:opacity-50"
                            disabled={item.quantity >= item.stock}
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatPrice(item.price)} / unité
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Résumé de la commande
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Sous-total ({totalItems} produits)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Gratuite</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total TTC</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full py-6 text-lg font-bold">
                Passer à la caisse
              </Button>
            </Link>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  🛡️
                </div>
                <span>Paiement sécurisé par Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                  🚚
                </div>
                <span>Livraison offerte dès 50€ d'achat</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
