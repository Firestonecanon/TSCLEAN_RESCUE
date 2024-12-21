import React, { useState } from 'react';
import { Plus, Minus, Save, X, Trash2, Edit } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import type { InventoryItem } from '../../types/inventory';
import ProductEditForm from './ProductEditForm';

interface InventoryItemRowProps {
  item: InventoryItem;
}

export default function InventoryItemRow({ item }: InventoryItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateStock, deleteProduct, updateProduct } = useInventory();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await updateStock(item.id, quantity);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(item.id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleCancel = () => {
    setQuantity(item.quantity);
    setIsEditing(false);
  };

  const handleProductUpdate = async (updatedProduct: InventoryItem) => {
    try {
      await updateProduct(updatedProduct);
      setIsEditingProduct(false);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (isEditingProduct) {
    return (
      <tr>
        <td colSpan={5}>
          <ProductEditForm
            product={item}
            onSubmit={handleProductUpdate}
            onCancel={() => setIsEditingProduct(false)}
          />
        </td>
      </tr>
    );
  }

  const getStockStatus = () => {
    if (!item.inStock) return 'bg-red-100 text-red-800';
    if (item.quantity < 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-4 sm:px-6 w-1/3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12">
            <img
              className="w-full h-full rounded-lg object-cover"
              src={item.image}
              alt={item.name}
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </p>
            <p className="text-sm text-gray-500 truncate md:hidden">
              {item.category}
            </p>
            {item.variant && (
              <p className="text-xs text-blue-600 truncate">
                {item.variant}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-4 sm:px-6 hidden md:table-cell w-1/6">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {item.category}
        </span>
      </td>
      <td className="px-3 py-4 sm:px-6 w-1/6">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              disabled={isUpdating}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              className="w-16 px-2 py-1 border rounded text-center disabled:opacity-50"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
              disabled={isUpdating}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              disabled={isUpdating}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStockStatus()}`}>
            {item.quantity} en stock
          </span>
        )}
      </td>
      <td className="px-3 py-4 sm:px-6 hidden md:table-cell w-1/6">
        <span className="text-sm text-gray-500">
          {new Date(item.lastUpdated).toLocaleDateString()}
        </span>
      </td>
      <td className="px-3 py-4 sm:px-6 w-1/6">
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="inline-flex items-center p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
                title="Sauvegarder"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="inline-flex items-center p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
                title="Annuler"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                title="Modifier le stock"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditingProduct(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                title="Modifier le produit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}