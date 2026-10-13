const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&lt;': '<',
  '&gt;': '>',
};

export function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z#0-9]+;/gi, (match) => ENTITIES[match.toLowerCase()] ?? match);
}

/** Splits a curatorial note — plain text or light HTML — into readable paragraphs. */
export function toParagraphs(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(/\n\s*\n|<\/p>|<br\s*\/?>/i)
    .map((chunk) => decodeEntities(chunk.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim())
    .filter((chunk) => chunk.length > 0);
}

export function ordinal(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function groupThousands(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function pluralise(count: number, singular: string, plural?: string): string {
  return `${groupThousands(count)} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
