import React from 'react';
import { ProductList } from '../components/products/ProductList';
import { QuickNav } from '../components/navigation/QuickNav';
import { useInventory } from '../contexts/InventoryContext';

export default function Products() {
  const { inventory, isLoading } = useInventory();

  // Transformer l'inventaire en groupes de produits
  const productGroups = React.useMemo(() => {
    const groups = {
      lessive: { title: 'Lessives', description: 'Nos lessives professionnelles concentrées', products: [] },
      assouplissant: { title: 'Assouplissants', description: 'Des assouplissants aux parfums délicats', products: [] },
      nettoyant: { title: 'Nettoyants Sol', description: 'Des nettoyants multi-usage efficaces', products: [] },
      parfum: { title: 'Parfums Auto', description: 'Des parfums longue durée', products: [] },
      divers: { title: 'Produits Divers', description: 'Autres produits d\'entretien', products: [] }
    };

    inventory.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].products.push(item);
      }
    });

    return Object.entries(groups)
      .filter(([_, group]) => group.products.length > 0)
      .map(([category, group]) => ({
        category: category,
        title: group.title,
        description: group.description,
        products: group.products
      }));
  }, [inventory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Nos Produits</h1>
      <QuickNav />
      <ProductList groups={productGroups} />
      <div className="h-20 lg:hidden">
        {/* Espace pour la navigation mobile */}
      </div>
    </div>
  );
}