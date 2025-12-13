/**
 * Shared types for HOPSTECH Portfolio Website
 */

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  thumbnail: string | null;
  images: string[] | null;
  technologies: string[] | null;
  category: string;
  client: string | null;
  url: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
  metrics: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  features: string[] | null;
  pricing: Record<string, any> | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  author: string;
  tags: string[] | null;
  published: boolean;
  views: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string | null;
  rating: number;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

export interface ProjectFilters {
  category?: string;
  technology?: string;
  search?: string;
}

export interface BlogFilters {
  tag?: string;
  search?: string;
}

// Language types
export type Language = 'en' | 'fr' | 'es' | 'de';

export interface TranslationKeys {
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    blog: string;
    contact: string;
  };
  hero: {
    greeting: string;
    title: string;
    subtitle: string;
    cta: string;
    contact: string;
  };
  // Add more translation keys as needed
}
