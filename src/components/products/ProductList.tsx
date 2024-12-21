import React from 'react';
import { ProductGroup } from '../../types';
import ProductSection from './ProductSection';

interface ProductListProps {
  groups: ProductGroup[];
}

export function ProductList({ groups }: ProductListProps) {
  return (
    <div className="space-y-16">
      {groups.map(group => (
        <ProductSection key={group.category} group={group} />
      ))}
    </div>
  );
}