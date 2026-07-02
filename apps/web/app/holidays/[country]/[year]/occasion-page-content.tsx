import Image from 'next/image';
import { Occasion } from '@/lib/occassion-api';

interface OccasionPageContentProps {
  country: {
    code: string;
    name: string;
  };
  occasion: Occasion;
}

export function OccasionPageContent({
  country,
  occasion,
}: OccasionPageContentProps) {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <article className="space-y-6">
        <header className="space-y-3">
          <div className="text-sm text-muted-foreground">{country.name}</div>

          <h1 className="text-4xl font-bold tracking-tight">{occasion.name}</h1>

          {occasion.updated_at && (
            <p className="text-sm text-muted-foreground">
              Updated {new Date(occasion.updated_at).toLocaleDateString()}
            </p>
          )}
        </header>

        {occasion.image && (
          <figure className="space-y-2">
            <Image
              src={occasion.image.url}
              alt={occasion.image.alt || occasion.name}
              width={1200}
              height={675}
            />

            {occasion.image.photographer && (
              <figcaption className="text-xs text-muted-foreground">
                Photo by{' '}
                <a
                  href={occasion.image.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {occasion.image.photographer}
                </a>
              </figcaption>
            )}
          </figure>
        )}

        <section className="prose prose-neutral dark:prose-invert max-w-none">
          <p>{occasion.description}</p>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="mb-2 text-lg font-semibold">Holiday Information</h2>

          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium">Country</dt>
              <dd className="text-muted-foreground">{country.name}</dd>
            </div>

            <div>
              <dt className="font-medium">Holiday URL</dt>
              <dd className="text-muted-foreground">
                /holidays/{country.code.toLowerCase()}/{occasion.url}
              </dd>
            </div>
          </dl>
        </section>
      </article>
    </main>
  );
}
