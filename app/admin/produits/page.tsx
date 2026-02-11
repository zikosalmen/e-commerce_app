import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

import { ProductTable } from '@/components/admin/ProductTable';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Produits</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez votre catalogue de produits, prix et stocks.
          </p>
        </div>
        <Link href="/admin/produits/nouveau">
          <Button className="gap-2">
            <FiPlus />
            Nouveau Produit
          </Button>
        </Link>
      </div>

      <ProductTable initialProducts={products} />
  );
}
