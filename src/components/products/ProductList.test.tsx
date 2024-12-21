import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductList } from './ProductList';
import { InventoryProvider } from '../../contexts/InventoryContext';

const mockGroups = [
  {
    category: 'lessive',
    title: 'Lessives',
    description: 'Test description',
    products: [
      {
        id: 'test-1',
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        image: 'test.jpg',
        category: 'lessive',
        quantity: 5,
        inStock: true,
        lastUpdated: new Date().toISOString()
      }
    ]
  }
];

describe('ProductList', () => {
  it('renders product groups correctly', () => {
    render(
      <InventoryProvider>
        <ProductList groups={mockGroups} />
      </InventoryProvider>
    );

    expect(screen.getByText('Lessives')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles empty groups', () => {
    render(
      <InventoryProvider>
        <ProductList groups={[]} />
      </InventoryProvider>
    );

    expect(screen.queryByText('Lessives')).not.toBeInTheDocument();
  });
});