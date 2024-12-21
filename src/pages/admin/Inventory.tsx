import React, { useState } from 'react';
import { Package, AlertTriangle, Search, Plus } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import InventoryItemRow from '../../components/admin/InventoryItemRow';
import { QuickNav } from '../../components/admin/QuickNav';
import BackupManager from '../../components/admin/BackupManager';
import ProductForm from '../../components/admin/ProductForm';
import type { ProductCategory } from '../../types';

export default function Inventory() {
  const { inventory, error, isLoading, createProduct } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProductForm
          onSubmit={async (data) => {
            await createProduct(data);
            setShowProductForm(false);
          }}
          onCancel={() => setShowProductForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        {/* Section principale de l'inventaire */}
        <div>
          <div className="sm:flex sm:items-center mb-6">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">
                Gestion des Stocks
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Gérez l'inventaire de tous vos produits
              </p>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16">
              <button
                onClick={() => setShowProductForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau produit
              </button>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <QuickNav 
              onCategorySelect={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-3 py-3 sm:px-6 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-3 py-3 sm:px-6 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière mise à jour
                  </th>
                  <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <InventoryItemRow 
                    key={item.id} 
                    item={item}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section des sauvegardes */}
        <div>
          <BackupManager />
        </div>
      </div>
    </div>
  );
}