export type OccasionImage = {
  url: string;
  thumb?: string;
  alt?: string;
  photographer?: string;
  photographer_url?: string;
  unsplash_url?: string;
  query?: string;
};

export interface Occasion {
  occasion_id: number;
  url: string;
  name: string;
  description: string;
  image?: OccasionImage | null;
  updated_at?: string;
}

export async function fetchOccasion(
  env: CloudflareEnv,
  url: string,
) {
  if (env.NEXTJS_ENV === "development") {
    return {
      occasion_id: "sample_diwali",
      url,
      name: "Diwali",
      description: "Diwali, also known as the Festival of Lights, is one of the most widely celebrated Hindu festivals. It symbolizes the victory of light over darkness and good over evil. The festival is observed with prayers, family gatherings, decorations, gifts, and fireworks across India and many other countries.",
      image: {
        url: "https://images.unsplash.com/photo-1770904112863-92ab4888d723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzQ2NDB8MHwxfHNlYXJjaHwxfHxBbWVyaWNhbiUyMFNhbW9hJTIwZmxhZyUyMGFuZCUyMGN1bHR1cmFsJTIwZGFuY2V8ZW58MHwwfHx8MTc4Mjk4NjU3NXww&ixlib=rb-4.1.0&q=80&w=1080",
        thumb: "https://images.unsplash.com/photo-1770904112863-92ab4888d723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzQ2NDB8MHwxfHNlYXJjaHwxfHxBbWVyaWNhbiUyMFNhbW9hJTIwZmxhZyUyMGFuZCUyMGN1bHR1cmFsJTIwZGFuY2V8ZW58MHwwfHx8MTc4Mjk4NjU3NXww&ixlib=rb-4.1.0&q=80&w=400",
        alt: "Diwali festival lights and decorations",
        photographer: "Sample Photographer",
        photographer_url: "https://unsplash.com",
        unsplash_url: "https://unsplash.com",
        query: "diwali festival",
      },
      updated_at: "2026-01-15T00:00:00.000Z",
    } as unknown as Occasion;
  }

  const session = env.DB.withSession();

  const sqlQuery = session.prepare(`
    SELECT
      occasion_id,
      url,
      name,
      description,
      image,
      updated_at
    FROM Occasions
    WHERE url = ?
    LIMIT 1
  `).bind(url);

  const occasion = await sqlQuery.first<Occasion>();
  if (occasion && occasion.image) {
    occasion.image = JSON.parse(occasion.image as unknown as string) as OccasionImage;
  }

  return occasion;
}

export async function fetchOccasions(
  env: CloudflareEnv,
) {
  try {
    const session = env.DB.withSession();

    const sqlQuery = session.prepare(`
    SELECT
      occasion_id,
      url,
      name,
      updated_at
    FROM Occasions
    where description IS NOT NULL
    ORDER BY updated_at DESC
  `);

    const { results } = await sqlQuery.all<Occasion>();
    return results;
  } catch (error) {
    console.error("Error fetching occasions:", error);
    return [];
  }
}