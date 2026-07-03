import { Occasion } from '@/lib/occassion-api';
import { PageLayout } from '@/components/page-layout';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  CalendarRange,
  ListOrdered,
  Palmtree,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Country } from '@/lib/countries-data';
import { currentYear, Holiday } from '@/lib/holidays-api';
import Image from 'next/image';
import { Breadcrumb } from '@/components/breadcrumb';

interface OccasionPageContentProps {
  country: Country;
  occasion: Occasion;
  holidays: Holiday[];
}

export function OccasionPageContent({
  country,
  occasion,
  holidays,
}: OccasionPageContentProps) {
  const currentYearRow = useMemo(
    () => holidays.find((d) => d.year === currentYear),
    [holidays],
  );

  const internalLinks = [
    {
      to: `/upcoming-holidays/${country.slug}`,
      label: 'Upcoming holidays',
      icon: CalendarDays,
    },
    {
      to: `/long-weekends/${country.slug}`,
      label: `Upcoming long weekends in ${country.name}`,
      icon: Palmtree,
    },
    {
      to: `/holidays/${country.code.toLowerCase()}/${currentYear}`,
      label: `All holidays in ${country.name}`,
      icon: ListOrdered,
    },
    {
      to: `/calendars/${country.slug}`,
      label: `${country.name} holidays calendar`,
      icon: CalendarRange,
    },
  ];

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Countries', href: '/countries' },
          { label: `${country.name}` },
        ]}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {occasion.name} in {country.name}
          </h1>
          {currentYearRow && (
            <p className="text-muted-foreground">
              In {currentYear}, {occasion.name} falls on{' '}
              <span className="font-medium text-foreground">
                {format(parseISO(currentYearRow.date), 'EEEE, d MMMM yyyy')}
              </span>
              .
            </p>
          )}
        </div>

        {occasion.image && (
          <div className="overflow-hidden rounded-lg border">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={occasion.image.url}
                alt={
                  occasion.image.alt || occasion.image.query || occasion.name
                }
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </AspectRatio>
            <div className="px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>
                Photo by{' '}
                <a
                  href={occasion.image.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {occasion.image.photographer}
                </a>{' '}
                on{' '}
                <a
                  href={occasion.image.unsplash_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Unsplash
                </a>
              </span>
              {occasion.updated_at && (
                <span>
                  Updated {format(parseISO(occasion.updated_at), 'd MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">About {occasion.name}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {occasion.description}
        </p>
      </section>

      <Separator />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {occasion.name} dates in {country.name}
          </h2>
          {holidays.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Observance dates for {occasion.name} across a 10-year window (
              {holidays[0]?.year}-{holidays[holidays.length - 1]?.year}).
            </p>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Holiday</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((row) => {
                const isCurrent = row.year === currentYear;
                return (
                  <TableRow
                    key={row.year}
                    className={isCurrent ? 'bg-muted/50' : undefined}
                  >
                    <TableCell className="font-medium">
                      {row.year}
                      {isCurrent && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          This year
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(parseISO(row.date), 'd MMM yyyy')}
                    </TableCell>
                    <TableCell>{format(parseISO(row.date), 'EEEE')}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {occasion.name}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {holidays.map((row) => {
            const isCurrent = row.year === currentYear;
            return (
              <Card
                key={row.year}
                className={isCurrent ? 'border-primary' : undefined}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {format(parseISO(row.date), 'd MMM yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(row.date), 'EEEE')} · {occasion.name}
                    </p>
                  </div>
                  <Badge variant={isCurrent ? 'default' : 'secondary'}>
                    {row.year}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Explore more
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {internalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                href={link.to}
                prefetch={false}
                className="group flex items-center gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
}
