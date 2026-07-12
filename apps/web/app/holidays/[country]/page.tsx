import { PageLayout } from '@/components/page-layout';
import { OccasionsList } from '@/components/occasions-list';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { fetchOccasions } from '@/lib/occassion-api';
import { getCountryByCode, getCountryBySlug } from '@/lib/countries-data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export const metadata = {
  title: 'Holidays - 11holidays.com',
  description:
    'Browse public holidays for 230+ countries. Select a country to view its holiday list.',
};

export default async function HolidaysPage({ params }: PageProps) {
  const { country: countryCode } = await params;

  const country = getCountryByCode(countryCode);
  if (!country) {
    notFound();
  }

  const currentYear = new Date().getFullYear();
  const { env } = getCloudflareContext();

  const occasions = await fetchOccasions(env, country.code);

  return (
    <PageLayout sidebar={false}>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight md:text-4xl">
          Holidays in {country.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          List of holidays in {country.name} in {currentYear}
        </p>
      </div>

      <OccasionsList
        occasions={occasions}
        title={null}
        showBrowseAll={false}
        emptyMessage={'No holidays found.'}
      />
    </PageLayout>
  );
}
