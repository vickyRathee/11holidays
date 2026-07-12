import { ArrowRight, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Occasion } from '../lib/occassion-api';
import Link from 'next/link';

interface OccasionsListProps {
  occasions: Occasion[];
  /** Max items to render. When set and less than total, a "Browse all" link is shown. */
  limit?: number;
  /** Path used by the "Browse all" link. Defaults to /holidays. */
  browseAllHref?: string;
  /** Heading text. Pass null to hide the heading row. */
  title?: string | null;
  /** Optional subtitle shown under the title. */
  subtitle?: string;
  /** Force the browse-all link on or off. Defaults to auto (based on limit). */
  showBrowseAll?: boolean;
  className?: string;
  /** Empty state message. */
  emptyMessage?: string;
}

export function OccasionsList({
  occasions,
  limit,
  browseAllHref = '/holidays',
  title = 'Upcoming Holidays',
  subtitle,
  showBrowseAll,
  className,
  emptyMessage = 'No holidays found.',
}: OccasionsListProps) {
  const items =
    typeof limit === 'number' ? occasions.slice(0, limit) : occasions;
  const shouldShowBrowseAll =
    showBrowseAll ?? (typeof limit === 'number' && occasions.length > limit);

  return (
    <section className={cn('space-y-4', className)}>
      {title !== null && (
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {shouldShowBrowseAll && (
            <Button asChild variant="ghost" size="sm" className="shrink-0">
              <Link href={browseAllHref} prefetch={false}>
                Browse all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((o) => (
            <Card key={o.occasion_id} className="overflow-hidden group">
              <Link href={o.url} className="block">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <Image
                    src={o.image?.url || ''}
                    alt={o.image?.alt ?? o.name}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
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
