import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Occasion } from '../lib/occassion-api';
import Link from 'next/link';
import { CountryFlag } from './country-flag';

interface OccasionsListProps {
  occasions: Occasion[];
  limit?: number;
  className?: string;
  emptyMessage?: string;
}

export function OccasionsList({
  occasions,
  limit,
  className,
  emptyMessage = 'No holidays found.',
}: OccasionsListProps) {
  const items =
    typeof limit === 'number' ? occasions.slice(0, limit) : occasions;

  return (
    <section className={cn('space-y-4', className)}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((o) => (
            <Card key={o.occasion_id} className="overflow-hidden group py-0">
              <Link href={`/holidays/${o.url}`} className="block">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  {o.image?.url ? (
                    <Image
                      src={o.image.url}
                      alt={o.image?.alt ?? o.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6">
                      <CountryFlag
                        countryCode={o.country!}
                        className="h-16 w-auto rounded shadow-sm"
                      />
                    </div>
                  )}
                </AspectRatio>
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-semibold group-hover:underline">
                    {o.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {o.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
