'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice, getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface ProductTableProps {
  initialProducts: any[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un produit ou une catégorie..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-sm">Produit</th>
                <th className="px-6 py-4 font-semibold text-sm">Catégorie</th>
                <th className="px-6 py-4 font-semibold text-sm">Prix</th>
                <th className="px-6 py-4 font-semibold text-sm">Stock</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={getImageUrl(JSON.parse(product.images)[0] || product.imageUrl)}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-[300px]">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">ID: {product.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <p className="font-semibold">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatPrice(product.comparePrice)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className={`font-medium ${
                      product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/produits/${product.id}`}>
                        <Button variant="ghost" size="sm" className="p-2">
                          <FiEdit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
