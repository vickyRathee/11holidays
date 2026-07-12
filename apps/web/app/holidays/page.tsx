import { PageLayout } from '@/components/page-layout';
import { OccasionsList } from '@/components/occasions-list';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { fetchOccasions } from '@/lib/occassion-api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Holidays - 11holidays.com',
  description:
    'Browse public holidays for 230+ countries. Select a country to view its holiday list.',
};

export default async function HolidaysPage() {
  const currentYear = new Date().getFullYear();
  const { env } = await getCloudflareContext({ async: true });

  const occasions = await fetchOccasions(env);

  return (
    <PageLayout sidebar={false}>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight md:text-4xl">
          Holidays in {currentYear}
        </h1>
        <p className="text-lg text-muted-foreground">
          Select a country to view its public holidays for {currentYear}
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
