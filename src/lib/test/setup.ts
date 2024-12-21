import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

// Mock handlers for Supabase API
const handlers = [
  http.get('*/rest/v1/inventory*', () => {
    return HttpResponse.json([
      {
        id: 'test-1',
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        image: 'test.jpg',
        category: 'lessive',
        quantity: 5,
        in_stock: true,
        last_updated: new Date().toISOString()
      }
    ]);
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());