import type { InventoryItem } from '../../types/inventory';
import { COLUMNS } from './schema';

export function formatDatabaseItem(item: any): InventoryItem {
  return {
    id: item[COLUMNS.ID],
    name: item[COLUMNS.NAME],
    description: item[COLUMNS.DESCRIPTION],
    price: item[COLUMNS.PRICE],
    image: item[COLUMNS.IMAGE],
    category: item[COLUMNS.CATEGORY],
    variant: item[COLUMNS.VARIANT],
    size: item[COLUMNS.SIZE],
    quantity: item[COLUMNS.QUANTITY],
    inStock: item[COLUMNS.IN_STOCK],
    lastUpdated: item[COLUMNS.LAST_UPDATED]
  };
}

export function formatInventoryForDatabase(item: InventoryItem) {
  return {
    [COLUMNS.ID]: item.id,
    [COLUMNS.NAME]: item.name,
    [COLUMNS.DESCRIPTION]: item.description,
    [COLUMNS.PRICE]: item.price,
    [COLUMNS.IMAGE]: item.image,
    [COLUMNS.CATEGORY]: item.category,
    [COLUMNS.VARIANT]: item.variant || null,
    [COLUMNS.SIZE]: item.size || null,
    [COLUMNS.QUANTITY]: item.quantity,
    [COLUMNS.IN_STOCK]: item.quantity > 0,
    [COLUMNS.LAST_UPDATED]: new Date().toISOString()
  };
}