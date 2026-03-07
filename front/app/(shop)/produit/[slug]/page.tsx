import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getImageUrl, formatPrice } from '@/lib/utils';
import { FiShoppingCart, FiCheck, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

import { ProductGallery } from '@/components/shop/ProductGallery';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
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
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Handle images parsing and default logic
  let imagesArr: string[] = [];
  try {
    if (product.images) {
      imagesArr = JSON.parse(product.images);
    }
  } catch (e) {
    console.error('Error parsing product images JSON:', e);
  }

  if (imagesArr.length === 0 && product.imageUrl) {
    imagesArr = [product.imageUrl];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/boutique" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FiArrowLeft className="mr-2" />
        Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery Section */}
        <ProductGallery productName={product.name} images={imagesArr} />

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
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
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
