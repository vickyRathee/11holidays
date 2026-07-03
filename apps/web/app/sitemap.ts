import { MetadataRoute } from 'next';
import { COUNTRIES_WITH_SLUG } from '@/lib/countries-data';

const BASE_URL = 'https://11holidays.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const year = new Date().getFullYear();

  const holidaysEntries = COUNTRIES_WITH_SLUG.flatMap((x) => [
    {
      url: `${BASE_URL}/holidays/${x.code.toLowerCase()}/${year}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/upcoming-holidays/${x.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/long-weekends/${x.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]) satisfies MetadataRoute.Sitemap;

  const calendarEntries = COUNTRIES_WITH_SLUG.map((x) => ({
    url: `${BASE_URL}/calendars/${x.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  })) satisfies MetadataRoute.Sitemap;

  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/countries`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/calendars`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date('2025-12-20T05:07:12.287Z'),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...holidaysEntries,
    ...calendarEntries,
  ];
}
