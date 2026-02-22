import { prisma } from '@/front/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Sanitize data for the client component
  const initialData = {
    ...product,
    price: product.price.toString(),
    comparePrice: product.comparePrice?.toString() || '',
    stock: product.stock.toString(),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modifier le Produit</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          ID: {product.id}
        </p>
      </div>

      <ProductForm initialData={initialData} productId={product.id} />
    </div>
  );
}
