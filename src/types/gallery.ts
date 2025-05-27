
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  height: number;
  width: number;
  category: string;
  created_at?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
}
