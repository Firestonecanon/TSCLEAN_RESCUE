// Définition du schéma de la base de données
export const TABLES = {
  INVENTORY: 'inventory'
} as const;

export const COLUMNS = {
  ID: 'id',
  NAME: 'name',
  DESCRIPTION: 'description',
  PRICE: 'price',
  IMAGE: 'image',
  CATEGORY: 'category',
  VARIANT: 'variant',
  SIZE: 'size',
  QUANTITY: 'quantity',
  IN_STOCK: 'in_stock',
  LAST_UPDATED: 'last_updated'
} as const;