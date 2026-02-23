import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface BoutiquePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Boutique | E-Shop',
  description: 'Découvrez tous nos produits',
};

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const { category, search, sort } = await searchParams;

  const where: any = {};

  if (category) {
    where.category = {
      name: category
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (sort === 'price_asc') orderBy.price = 'asc';
  else if (sort === 'price_desc') orderBy.price = 'desc';
  else orderBy.createdAt = 'desc';

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {category ? `Catégorie : ${category}` : `Toute la boutique`}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <Link href="/boutique">
            <Button variant={!category ? 'primary' : 'outline'} size="sm">
              Tout
            </Button>
          </Link>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/boutique?category=${encodeURIComponent(cat.name)}`}>
              <Button
                variant={category === cat.name ? 'primary' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-500">Aucun produit trouvé.</p>
          {category && (
            <Link href="/boutique" className="mt-4 inline-block">
              <Button variant="ghost">Voir tous les produits</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
