import React from 'react';
import { ProductGroup } from '../../types';
import { ProductCard } from './ProductCard';
import { Shirt, Wind, Droplets, Car, Package } from 'lucide-react';

const categoryIcons = {
  lessive: Shirt,
  assouplissant: Wind,
  nettoyant: Droplets,
  parfum: Car,
  divers: Package,
} as const;

interface ProductSectionProps {
  group: ProductGroup;
}

export default function ProductSection({ group }: ProductSectionProps) {
  const Icon = categoryIcons[group.category];

  return (
    <div id={group.category} className="scroll-mt-24">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold">{group.title}</h2>
        </div>
        <p className="text-gray-600">{group.description}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {group.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}