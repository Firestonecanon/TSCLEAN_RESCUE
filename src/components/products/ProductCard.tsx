import React from 'react';
import { Package, AlertTriangle, Sparkles, Tag } from 'lucide-react';
import { Product } from '../../types';
import { useInventory } from '../../contexts/InventoryContext';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { inventory } = useInventory();
  const inventoryItem = inventory.find(item => item.id === product.id);
  const stockStatus = inventoryItem?.quantity ?? 0;
  const isOutOfStock = stockStatus === 0;
  const isLowStock = stockStatus > 0 && stockStatus < 5;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ProductImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              Nouveau
            </span>
          )}
          {product.isPromo && (
            <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded-full flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              Promo
            </span>
          )}
        </div>

        {/* Badge de stock */}
        <div className={`absolute top-2 right-2 px-3 py-1.5 rounded-full text-sm font-bold 
          ${isOutOfStock 
            ? 'bg-red-500 text-white' 
            : isLowStock
              ? 'bg-yellow-500 text-white'
              : 'bg-green-500 text-white'
          } md:hidden`}
        >
          {isOutOfStock 
            ? '⚠️ Rupture' 
            : `${stockStatus} en stock`}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.variant && (
          <p className="text-sm text-blue-600 mb-2">
            Parfum: {product.variant}
          </p>
        )}
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            {product.isPromo ? (
              <>
                <span className="text-gray-400 line-through">{product.price.toFixed(2)} €</span>
                <span className="text-red-600 font-bold">{product.promoPrice?.toFixed(2)} €</span>
              </>
            ) : (
              <p className="text-blue-600 font-bold">{product.price.toFixed(2)} €</p>
            )}
          </div>
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