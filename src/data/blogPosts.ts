import type { ImageMetadata } from 'astro';
import valleyCenterParkPhoto from '../assets/blog/1-local-guide-valley-center/valley-center-mclaughlin-park.jpg';

export interface BlogPostSummary {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  description: string;
  excerpt: string;
  category: string;
  location: string;
  author: string;
  publishedDate: string;
  displayDate: string;
  photoLabel: string;
  thumbnail: ImageMetadata;
  thumbnailAlt: string;
  thumbnailCredit?: string;
  socialImage?: string;
  socialImageAlt?: string;
}

export const valleyCenterFavoritesPost: BlogPostSummary = {
  slug: 'local-guide-valley-center-hometown-favorites',
  href: '/blog/local-guide-valley-center-hometown-favorites/',
  title: "A Local's Guide to Valley Center: Hometown Favorites",
  subtitle: "Ice cream on Main Street, an afternoon at the park, and one of Valley Center's biggest weekends of the year.",
  description: 'A local look at The Purple Spoon, McLaughlin Park, and the Valley Center Fall Festival in Valley Center, Kansas.',
  excerpt: 'Three hometown favorites that offer a closer look at everyday life and community traditions in Valley Center.',
  category: 'Hometown favorites',
  location: 'Valley Center',
  author: 'Charity Menefee',
  publishedDate: '2026-08-13',
  displayDate: 'August 13, 2026',
  photoLabel: 'Valley Center hometown favorites',
  thumbnail: valleyCenterParkPhoto,
  thumbnailAlt: 'Children playing in the splash pad at McLaughlin Park in Valley Center',
  socialImage: '/images/static/blog/valley-center-hometown-favorites-social.jpg',
  socialImageAlt: 'Aerial view of carnival rides and crowds at the Valley Center Fall Festival at night',
};

export const blogPosts: BlogPostSummary[] = [valleyCenterFavoritesPost];
