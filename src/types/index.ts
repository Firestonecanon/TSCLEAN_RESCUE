export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  variant?: string;
  size?: string;
  isNew?: boolean;
  isPromo?: boolean;
  promoPrice?: number;
}

export type ProductCategory = 'lessive' | 'assouplissant' | 'nettoyant' | 'parfum' | 'divers';

export interface ProductGroup {
  category: ProductCategory;
  title: string;
  description: string;
  products: Product[];
}

export interface Location {
  id: string;
  address: string;
  googleMapsUrl: string;
  googleBusinessUrl: string;
}