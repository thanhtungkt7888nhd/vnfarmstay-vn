import { createClient } from "next-sanity";

/** Client Sanity — điền SANITY_PROJECT_ID vào .env.local khi có tài khoản */
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-04-29",
  useCdn: process.env.NODE_ENV === "production",
});

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}
