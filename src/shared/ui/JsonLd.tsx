/**
 * Component render JSON-LD an toàn — Lệnh 17-MEGA.
 * Nhận bất kỳ schema object và render thành <script type="application/ld+json">.
 */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any | any[];
}

/** Server component — inject JSON-LD vào <head> hoặc cuối <body> */
export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
