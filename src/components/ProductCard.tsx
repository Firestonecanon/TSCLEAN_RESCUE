import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.variant && (
          <p className="text-sm text-blue-600 mb-2">
            Parfum: {product.variant}
          </p>
        )}
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-blue-600 font-bold">{product.price.toFixed(2)} €</p>
          {product.size && (
            <span className="text-sm text-gray-500">
              {product.size}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}