import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Product, ProductCategory } from '../../types';

interface ProductEditFormProps {
  product: Product;
  onSubmit: (data: Product) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES: ProductCategory[] = ['lessive', 'assouplissant', 'nettoyant', 'parfum', 'divers'];

export default function ProductEditForm({ product, onSubmit, onCancel }: ProductEditFormProps) {
  const [formData, setFormData] = useState<Product>(product);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.description.trim()) {
      setError('La description est requise');
      return;
    }
    if (formData.price <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }
    if (!formData.image.trim()) {
      setError("L'URL de l'image est requise");
      return;
    }
    if (formData.isPromo && (!formData.promoPrice || formData.promoPrice >= formData.price)) {
      setError('Le prix promotionnel doit être inférieur au prix normal');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Erreur lors de la modification du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Modifier le produit</h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Champs existants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Nouveaux champs pour les badges */}
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNew"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
              Marquer comme nouveau
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPromo"
              name="isPromo"
              checked={formData.isPromo}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPromo" className="ml-2 block text-sm text-gray-700">
              En promotion
            </label>
          </div>
        </div>

        {formData.isPromo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix promotionnel
            </label>
            <input
              type="number"
              name="promoPrice"
              value={formData.promoPrice || ''}
              onChange={handleChange}
              step="0.01"
              min="0"
              max={formData.price}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Autres champs existants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de l'image
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variante (optionnel)
          </label>
          <input
            type="text"
            name="variant"
            value={formData.variant || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taille (optionnel)
          </label>
          <input
            type="text"
            name="size"
            value={formData.size || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Modification...' : 'Modifier le produit'}
        </button>
      </div>
    </form>
  );
}