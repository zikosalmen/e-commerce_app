import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ajouter un Produit</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Remplissez les informations ci-dessous pour créer un nouveau produit.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
