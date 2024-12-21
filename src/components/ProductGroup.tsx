import React from 'react';
import { ProductGroup } from '../types';
import ProductCard from './ProductCard';

interface ProductGroupProps {
  group: ProductGroup;
}

export default function ProductGroup({ group }: ProductGroupProps) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{group.title}</h2>
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