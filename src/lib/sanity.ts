/**
 * Sanity client, urlFor helper và sanityFetch — dùng chung toàn dự án.
 * GROQ queries nằm ở sanity-queries.ts.
 * Types nằm ở features/blog/types.ts.
 */
import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

// ─── Client ──────────────────────────────────────────────────────────────────

const _projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const _isReal =
  _projectId && _projectId !== "placeholder" && _projectId.length > 4;

// Khi chưa config, dùng dummy hợp lệ để tránh Sanity SDK throw lúc module load.
// Mọi fetch thực tế đã được guard bởi isSanityConfigured() trong sanity-queries.ts.
export const sanityClient = createClient({
  projectId: _isReal ? _projectId : "a1b2c3d4",
  dataset: _isReal
    ? (process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production")
    : "production",
  apiVersion: "2026-04-29",
  useCdn: _isReal ? process.env.NODE_ENV === "production" : false,
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
  return sanityClient.fetch(query, params, {
    next: { revalidate: 60 },
  } as any) as Promise<T>;
}
