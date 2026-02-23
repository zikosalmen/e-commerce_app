import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { FiPercent } from 'react-icons/fi';

export const metadata = {
  title: 'Promotions | E-Shop',
  description: 'Profitez de nos meilleures offres',
};

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
  const products = await prisma.product.findMany({
    where: {
      comparePrice: {
        not: null,
      },
      // Ensure we only get products where price is actually lower than comparePrice
      // Prisma doesn't support field comparison in where clause directly easily in all DBs, 
      // but typically comparePrice exists means it's a promo.
      // We can filter in JS if needed, but let's assume existence implies promo.
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      category: true,
    },
  });

  // Filter to ensure discount is real (optional, but good practice)
  const promoProducts = products.filter(p => p.comparePrice && p.price < p.comparePrice);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            <FiPercent className="w-10 h-10 md:w-16 md:h-16" />
            Promotions & Offres
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Découvrez nos meilleures réductions sur une sélection de produits. 
            Profitez-en avant qu'il ne soit trop tard !
          </p>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl" />
      </div>

      {promoProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {promoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-500">
            Aucune promotion en cours pour le moment.
          </p>
          <p className="text-gray-400 mt-2">Revenez bientôt !</p>
        </div>
      )}
    </div>
  );
}
