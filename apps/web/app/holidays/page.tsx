import { PageLayout } from '@/components/page-layout';
import { OccasionsList } from '@/components/occasions-list';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { fetchOccasions } from '@/lib/occassion-api';
import { currentYear } from '@/lib/holidays-api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Holidays List - 11holidays.com',
  description:
    'Browse public and religious holidays globally. Pick a country or search by name.',
};

type HolidaysPageProps = {
  searchParams: Promise<{
    offset?: string;
  }>;
};

export default async function HolidaysPage({
  searchParams,
}: HolidaysPageProps) {
  const { env } = await getCloudflareContext({ async: true });

  const params = await searchParams;
  const offset = Math.max(0, Number(params.offset) || 0);
  const limit = 20;

  const occasions = await fetchOccasions(env, offset, limit);

  const hasPrevious = offset > 0;
  const hasNext = occasions.length >= limit;

  const previousOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  return (
    <PageLayout>
      <h1>Holidays in {currentYear}</h1>

      <p>Select a country to view its public holidays for {currentYear}</p>

      <OccasionsList occasions={occasions} />

      {(hasPrevious || hasNext) && (
        <nav aria-label="Pagination">
          {hasPrevious && (
            <a
              href={
                previousOffset === 0
                  ? '/holidays'
                  : `/holidays?offset=${previousOffset}`
              }
              rel="prev"
            >
              Previous
            </a>
          )}

          {hasNext && (
            <a href={`/holidays?offset=${nextOffset}`} rel="next">
              Next
            </a>
          )}
        </nav>
      )}
    </PageLayout>
  );
}
