'use client';

import { formatPrice, getImageUrl, parseJSON } from '@/lib/utils';
import type { Product } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const images = parseJSON<string[]>(product.images, []);
  const mainImage = images[0] || product.imageUrl || '/images/placeholder.jpg';
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;

  return (
    <Card hover className="group">
      <Link href={`/produit/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={getImageUrl(mainImage)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge variant="danger">
                -{Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}%
              </Badge>
            </div>
          )}

          {product.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Populaire</Badge>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="default" className="text-base px-4 py-2">
                Rupture de stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {product.category?.name}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Plus que {product.stock} en stock
              </p>
            )}
          </div>

          {product.stock > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="gap-2"
              >
                <FiShoppingCart />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
