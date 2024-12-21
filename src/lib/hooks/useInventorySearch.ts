import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { InventoryItem } from '../../types/inventory';
import type { ProductCategory } from '../../types';

interface UseInventorySearchProps {
  inventory: InventoryItem[];
  selectedCategory?: ProductCategory | 'all';
}

export function useInventorySearch({ inventory, selectedCategory = 'all' }: UseInventorySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           item.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [inventory, selectedCategory, debouncedSearch]);

  return {
    searchQuery,
    setSearchQuery,
    filteredInventory
  };
}