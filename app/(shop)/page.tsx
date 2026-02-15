import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/shop/ProductCard';
import { FiArrowRight } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Force refresh
  // Fetch featured products
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  // Fetch all products for "Tous les produits" section
  const allProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Bienvenue sur votre boutique moderne
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              Découvrez notre sélection de produits tech et lifestyle de qualité supérieure.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up">
              <Link href="/boutique">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Explorer la boutique
                </Button>
              </Link>
              <Link href="/promotions">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Voir les promos
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Produits populaires
            </h2>
            <Link href="/boutique?featured=true">
              <Button variant="ghost" className="gap-2">
                Voir tout
                <FiArrowRight />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Banner */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Découvrez nos catégories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Électronique', 'Accessoires', 'Audio', 'Caméras'].map((category) => (
              <Link
                key={category}
                href={`/boutique?category=${encodeURIComponent(category)}`}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tous les produits
          </h2>
          <Link href="/boutique">
            <Button variant="ghost" className="gap-2">
              Voir tout
              <FiArrowRight />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Inscrivez-vous à notre newsletter
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Recevez nos dernières offres et nouveautés directement dans votre boîte mail
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              S'inscrire
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
