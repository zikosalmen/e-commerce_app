'use client';

import { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiLock,
  FiCheck,
  FiCreditCard,
  FiTruck,
  FiUser,
  FiMapPin,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

type Step = 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
    phone: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCurrentStep('confirmation');
    clearCart();
    setLoading(false);
  };

  const steps = [
    { id: 'shipping', label: 'Livraison', icon: FiTruck },
    { id: 'payment', label: 'Paiement', icon: FiCreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: FiCheck },
  ];

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Ajoutez des produits avant de passer à la caisse.
          </p>
          <Link href="/boutique">
            <Button size="lg">Voir la boutique</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/panier"
        className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        Retour au panier
      </Link>

      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isPast =
            steps.findIndex((s) => s.id === currentStep) > idx;
          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : isPast
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {isPast ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    isPast ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 'shipping' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FiMapPin className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Adresse de livraison
                  </h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <Input
                    label="Nom complet"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    required
                    placeholder="Jean Dupont"
                  />
                  <Input
                    label="Adresse"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                    placeholder="123 Rue de la Paix"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Ville"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                      placeholder="Tunis"
                    />
                    <Input
                      label="Code postal"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleShippingChange}
                      required
                      placeholder="1000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Pays"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                    />
                    <Input
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full mt-6 gap-2">
                    Continuer vers le paiement
                    <FiCreditCard className="w-5 h-5" />
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {currentStep === 'payment' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Paiement
                  </h2>
                </div>

                {/* Shipping Summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <FiUser className="w-4 h-4" />
                    <span className="font-medium">{shippingInfo.fullName}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {shippingInfo.address}, {shippingInfo.postalCode} {shippingInfo.city}, {shippingInfo.country}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {shippingInfo.phone}
                  </p>
                  <button
                    onClick={() => setCurrentStep('shipping')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2"
                  >
                    Modifier l&apos;adresse
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <div className="p-4 border-2 border-primary-500 rounded-xl bg-primary-50/50 dark:bg-primary-900/10">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCreditCard className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Carte bancaire
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <Input
                        label="Numéro de carte"
                        placeholder="4242 4242 4242 4242"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Expiration" placeholder="MM/AA" />
                        <Input label="CVC" placeholder="123" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      <span className="font-medium">Paiement à la livraison (bientôt)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCurrentStep('shipping')}
                  >
                    Retour
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiLock className="w-5 h-5" />
                    )}
                    {loading ? 'Traitement...' : `Payer ${formatPrice(totalPrice)}`}
                  </Button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                  <FiLock className="w-3 h-3" /> Paiement sécurisé par Stripe
                </p>
              </Card>
            </motion.div>
          )}

          {currentStep === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Commande confirmée !
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Merci pour votre achat. Votre commande a été passée avec succès.
                </p>
                <p className="text-sm text-gray-400 mb-8">
                  Un email de confirmation vous sera envoyé à l&apos;adresse indiquée.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/boutique">
                    <Button size="lg" className="w-full sm:w-auto">
                      Continuer les achats
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Retour à l&apos;accueil
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {currentStep !== 'confirmation' && (
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Récapitulatif
              </h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(JSON.parse(item.images)[0] || item.imageUrl)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Sous-total ({totalItems})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
