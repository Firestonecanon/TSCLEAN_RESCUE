import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useInventorySearch } from './useInventorySearch';

const mockInventory = [
  {
    id: 'test-1',
    name: 'Test Lessive',
    description: 'Description lessive',
    price: 10,
    image: 'test.jpg',
    category: 'lessive',
    quantity: 5,
    inStock: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'test-2',
    name: 'Test Assouplissant',
    description: 'Description assouplissant',
    price: 8,
    image: 'test.jpg',
    category: 'assouplissant',
    quantity: 3,
    inStock: true,
    lastUpdated: new Date().toISOString()
  }
];

describe('useInventorySearch', () => {
  it('filters by category', () => {
    const { result } = renderHook(() => 
      useInventorySearch({ 
        inventory: mockInventory, 
        selectedCategory: 'lessive' 
      })
    );

    expect(result.current.filteredInventory).toHaveLength(1);
    expect(result.current.filteredInventory[0].name).toBe('Test Lessive');
  });

  it('filters by search query', () => {
    const { result } = renderHook(() => 
      useInventorySearch({ 
        inventory: mockInventory 
      })
    );

    act(() => {
      result.current.setSearchQuery('assouplissant');
    });

    // Wait for debounce
    setTimeout(() => {
      expect(result.current.filteredInventory).toHaveLength(1);
      expect(result.current.filteredInventory[0].name).toBe('Test Assouplissant');
    }, 350);
  });
});