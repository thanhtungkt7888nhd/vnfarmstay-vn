/**
 * Sanity client, urlFor helper và sanityFetch — dùng chung toàn dự án.
 * GROQ queries nằm ở sanity-queries.ts.
 * Types nằm ở features/blog/types.ts.
 */
import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

// ─── Client ──────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-04-29",
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

// ─── Image builder ────────────────────────────────────────────────────────────

const builder = createImageUrlBuilder(sanityClient);

/** Tạo URL ảnh Sanity với width, quality, format tự động */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

/** Fetch type-safe từ Sanity với Next.js cache ISR */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sanityClient.fetch(query, params, {
    next: { revalidate: 60 },
  } as any) as Promise<T>;
}
