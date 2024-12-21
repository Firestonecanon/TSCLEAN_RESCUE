import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InventoryItemRow from './InventoryItemRow';
import { InventoryProvider } from '../../contexts/InventoryContext';

const mockItem = {
  id: 'test-1',
  name: 'Test Product',
  description: 'Test Description',
  price: 10,
  image: 'test.jpg',
  category: 'lessive',
  quantity: 5,
  inStock: true,
  lastUpdated: new Date().toISOString()
};

describe('InventoryItemRow', () => {
  it('renders product information correctly', () => {
    render(
      <InventoryProvider>
        <InventoryItemRow item={mockItem} />
      </InventoryProvider>
    );

    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(mockItem.category)).toBeInTheDocument();
    expect(screen.getByText(`${mockItem.quantity} en stock`)).toBeInTheDocument();
  });

  it('allows editing stock quantity', async () => {
    render(
      <InventoryProvider>
        <InventoryItemRow item={mockItem} />
      </InventoryProvider>
    );

    // Click edit button
    fireEvent.click(screen.getByTitle('Modifier'));

    // Find quantity input
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();

    // Change quantity
    fireEvent.change(input, { target: { value: '10' } });
    expect(input).toHaveValue(10);
  });
});