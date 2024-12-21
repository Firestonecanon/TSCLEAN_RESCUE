import React from 'react';
import { Shirt, Wind, Droplets, Car, Package } from 'lucide-react';
import { ProductCategory } from '../../types';

const categoryIcons: Record<ProductCategory, typeof Shirt> = {
  lessive: Shirt,
  assouplissant: Wind,
  nettoyant: Droplets,
  parfum: Car,
  divers: Package,
};

const categoryLabels: Record<ProductCategory, string> = {
  lessive: 'Lessives',
  assouplissant: 'Assouplissants',
  nettoyant: 'Nettoyants',
  parfum: 'Parfums Auto',
  divers: 'Divers',
};

interface QuickNavProps {
  onCategorySelect: (category: ProductCategory | 'all') => void;
  selectedCategory: ProductCategory | 'all';
}

export function QuickNav({ onCategorySelect, selectedCategory }: QuickNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 mb-6">
      <button
        onClick={() => onCategorySelect('all')}
        className={`px-4 py-2 rounded-lg whitespace-nowrap ${
          selectedCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Tous les produits
      </button>
      {Object.entries(categoryIcons).map(([category, Icon]) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category as ProductCategory)}
          className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Icon className="h-5 w-5 mr-2" />
          {categoryLabels[category as ProductCategory]}
        </button>
      ))}
    </div>
  );
}