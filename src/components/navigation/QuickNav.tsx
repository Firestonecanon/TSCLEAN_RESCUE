import React from 'react';
import { Shirt, Wind, Droplets, Car, Package } from 'lucide-react';
import { ProductCategory } from '../../types';
import { productGroups } from '../../data/products';

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

export function QuickNav() {
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-24 z-50">
      <div className="hidden lg:block">
        <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-2">
          <div className="flex flex-col space-y-2">
            {productGroups.map((group) => {
              const Icon = categoryIcons[group.category];
              return (
                <button
                  key={group.category}
                  onClick={() => scrollToCategory(group.category)}
                  className="p-2 hover:bg-blue-50 rounded-lg group relative transition-colors duration-200"
                  aria-label={group.title}
                >
                  <Icon className="h-6 w-6 text-blue-600" />
                  <span className="absolute right-full mr-2 py-1 px-2 bg-blue-600 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {categoryLabels[group.category]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Version mobile */}
      <div className="lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-around p-2">
            {productGroups.map((group) => {
              const Icon = categoryIcons[group.category];
              return (
                <button
                  key={group.category}
                  onClick={() => scrollToCategory(group.category)}
                  className="flex flex-col items-center p-2 hover:text-blue-600 transition-colors duration-200"
                  aria-label={group.title}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{categoryLabels[group.category]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}