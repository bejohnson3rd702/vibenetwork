export interface VideoItem {
  id: string;
  title: string;
  image: string;
  tags: string[];
  videoUrl: string;
  linkUrl?: string;
}

export interface Category {
  title: string;
  aspectRatio?: string;
  items: VideoItem[];
}

export interface WhiteLabelConfig {
  id: string;
  name: string;
  domain: string;
  bg?: string;
  accent?: string;
  heroCopy?: string;
  btnPrimary?: string;
  sliderCount?: number;
  customSections?: string;
  heroImage?: string;
  logoImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export interface User {
  id: string;
  user_metadata?: {
    username?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}
