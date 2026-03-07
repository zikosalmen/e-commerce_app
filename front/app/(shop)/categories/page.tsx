import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { getImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nos Catégories | First Shop',
  description: 'Découvrez toutes nos catégories de produits First Shop',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Toutes nos catégories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Link key={category.id} href={`/boutique?category=${encodeURIComponent(category.name)}`}>
            <Card hover className="h-full group overflow-hidden">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                {category.image ? (
                  <Image
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-xl font-bold shadow-black/50 drop-shadow-md">
                    {category.name}
                  </h2>
                  <p className="text-sm opacity-90 shadow-black/50 drop-shadow-md">
                    {category._count.products} produits
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {category.description || 'Découvrez nos produits dans cette catégorie.'}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
