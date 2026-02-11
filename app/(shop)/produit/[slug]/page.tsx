import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getImageUrl } from '@/lib/utils';
import { FiShoppingCart, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  return {
    title: `${product.name} | E-Shop`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const images = product.images ? JSON.parse(product.images) : [];
  if (product.image) images.unshift(product.image); // Add legacy image if exists and not in images array? 
  // Actually schema has 'imageUrl' in Product (check schema), and 'images' JSON. 
  // Seed script uses 'images' JSON array. 
  // categories have 'image'.
  // Let's check schema again. Product has `imageUrl` String? and `images` String default("[]").
  
  // Clean up images array
  const displayImages = images.length > 0 ? images : product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/boutique" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FiArrowLeft className="mr-2" />
        Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
             {displayImages.length > 0 ? (
                <Image
                  src={getImageUrl(displayImages[0])}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
             )}
          </div>
          {displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {displayImages.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-primary-500 transition-colors">
                  <Image
                    src={getImageUrl(img)}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-full">
              {product.category.name}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.price.toFixed(2)} €
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-500 line-through">
                {product.comparePrice.toFixed(2)} €
              </span>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
             <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                <FiCheck className="w-5 h-5" />
                <span className="font-medium">En stock ({product.stock} disponibles)</span>
             </div>

            <Button size="lg" className="w-full md:w-auto gap-2">
              <FiShoppingCart className="w-5 h-5" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
