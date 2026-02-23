'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
  productId?: string;
}

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    comparePrice: initialData?.comparePrice || '',
    stock: initialData?.stock || '',
    categoryId: initialData?.categoryId || '',
    imageUrl: initialData?.imageUrl || '',
    featured: initialData?.featured || false,
  });

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/produits');
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || 'Une erreur est survenue');
      }
    } catch (error) {
      alert('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
            <Input
              label="Nom du produit"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: MacBook Pro 16"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prix (€)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                label="Prix barré (€ - optionnel)"
                name="comparePrice"
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Stock & Catégorie</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock initial"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Produit en vedette (affiché sur la page d'accueil)
              </label>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Image du Produit</h2>
            <Input
              label="URL de l'image"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
            {formData.imageUrl && (
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
              <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Support Cloudinary/Supabase à venir
              </p>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => router.back()}
              disabled={loading}
            >
              <FiX /> Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={loading}
            >
              <FiSave /> {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
