export interface SiteSection {
  id: string;
  title: string;
  path: string;
  content: SectionContent;
  displayOrder: number;
  isVisible: boolean;
}

export interface SectionContent {
  title: string;
  subtitle?: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
  components?: SectionComponent[];
}

export interface SectionComponent {
  type: 'text' | 'image' | 'gallery' | 'contact' | 'products';
  content: any;
}