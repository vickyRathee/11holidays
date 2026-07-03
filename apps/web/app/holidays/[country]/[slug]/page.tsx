import { notFound } from 'next/navigation';
import { fetchHolidays, fetchHolidaysByOcasionId } from '@/lib/holidays-api';
import { getCountryByCode } from '@/lib/countries-data';
import { HolidayPageContent } from './holiday-page-content';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { fetchOccasion } from '@/lib/occassion-api';
import { OccasionPageContent } from './occasion-page-content';

interface PageProps {
  params: Promise<{
    country: string;
    slug: string; // year or slug
  }>;
}

function isYear(value: string): boolean {
  return /^\d{4}$/.test(value);
}

export async function generateMetadata({ params }: PageProps) {
  const { country: countryParam, slug: value } = await params;

  const country = getCountryByCode(countryParam);

  if (!country) {
    return {
      title: 'Not Found',
    };
  }

  if (isYear(value)) {
    return {
      title: `${country.name} Holidays in ${value} - 11holidays`,
      description: `Complete list of public holidays in ${country.name} for ${value}. View, download, and integrate ${country.code} holiday data via API.`,
    };
  }

  return {
    title: `${value} - 11holidays`,
    description: `Learn about ${value}, its history, significance, and upcoming holiday dates.`,
  };
}

export default async function HolidayPage({ params }: PageProps) {
  const { country: countryParam, slug: value } = await params;

  const country = getCountryByCode(countryParam);

  if (!country) {
    notFound();
  }

  const { env } = getCloudflareContext();

  // /holidays/india/2026
  if (isYear(value)) {
    const year = Number(value);

    if (year < 2000 || year > 2100) {
      notFound();
    }

    const holidaysData = await fetchHolidays(env, country.code, year);

    return (
      <HolidayPageContent
        country={country}
        year={year}
        holidaysData={holidaysData}
      />
    );
  }

  // /holidays/india/diwali
  const slug = `${country.code.toLowerCase()}/${value}`;
  const occasion = await fetchOccasion(env, slug);

  if (!occasion) {
    notFound();
  }

  const holidays = await fetchHolidaysByOcasionId(env, occasion.occasion_id);

  return <OccasionPageContent country={country} occasion={occasion} holidays={holidays} />;
}
