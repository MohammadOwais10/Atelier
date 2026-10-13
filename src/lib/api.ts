/**
 * Data layer for the Cleveland Museum of Art Open Access API.
 * Free, no key required. https://openaccess-api.clevelandart.org
 *
 * The collection is almost entirely CC0, and images are served from a public
 * CDN that permits cross-origin embedding — so the same requests work on device
 * and in the browser without any special headers or a proxy.
 *
 * Responses are normalised into a stable, camelCased `Artwork` shape so that
 * screens never depend on the wire format or on snake_case field names.
 */

const API_ROOT = 'https://openaccess-api.clevelandart.org/api';

export const PAGE_SIZE = 12;

export type Artwork = {
  id: number;
  accessionNumber: string | null;
  title: string;
  artistName: string | null;
  /** Nationality / life dates, e.g. "American, 1738–1815". */
  artistMeta: string | null;
  dateDisplay: string | null;
  mediumDisplay: string | null;
  dimensions: string | null;
  department: string | null;
  origin: string | null;
  creditLine: string | null;
  artworkType: string | null;
  description: string | null;
  /** Primary display image (CDN "web" derivative). */
  imageUrl: string | null;
  isPublicDomain: boolean;
  /** Canonical museum page for the work. */
  pageUrl: string | null;
};

export type FeedPage = {
  items: Artwork[];
  total: number;
  page: number;
  hasMore: boolean;
};

export type FeedFilter = {
  /** Free-text query, e.g. a search term. */
  query?: string;
  /** Restricts to a single artwork type, e.g. "Painting". */
  type?: string;
};

type RawCreator = {
  role?: string | null;
  description?: string | null;
};

type RawImage = { url?: string | null };

type RawArtwork = {
  id?: number;
  accession_number?: string | null;
  title?: string | null;
  creators?: RawCreator[] | null;
  creation_date?: string | null;
  technique?: string | null;
  dimensions?: string | null;
  department?: string | null;
  culture?: string[] | string | null;
  creditline?: string | null;
  type?: string | null;
  description?: string | null;
  tombstone?: string | null;
  share_license_status?: string | null;
  url?: string | null;
  images?: { web?: RawImage | null } | null;
};

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function pickCreator(creators: RawCreator[]): RawCreator | null {
  const artist = creators.find((entry) => (entry.role ?? '').toLowerCase() === 'artist');
  return artist ?? creators[0] ?? null;
}

/** "John Singleton Copley (American, …)" -> "John Singleton Copley". */
function creatorName(description: string | null | undefined): string | null {
  const name = description?.split(' (')[0]?.trim();
  return name && name.length > 0 ? name : null;
}

/** "John Singleton Copley (American, 1738–1815)" -> "American, 1738–1815". */
function creatorMeta(description: string | null | undefined): string | null {
  const match = description?.match(/\(([^)]+)\)/);
  return match ? str(match[1]) : null;
}

function normalizeOrigin(culture: RawArtwork['culture']): string | null {
  if (Array.isArray(culture)) {
    const joined = culture.filter(Boolean).join(', ');
    return joined.length > 0 ? joined : null;
  }
  return str(culture);
}

function normalizeArtwork(raw: RawArtwork): Artwork {
  const creators = Array.isArray(raw.creators) ? raw.creators : [];
  const creator = pickCreator(creators);

  return {
    id: raw.id as number,
    accessionNumber: str(raw.accession_number),
    title: str(raw.title) ?? 'Untitled',
    artistName: creatorName(creator?.description),
    artistMeta: creatorMeta(creator?.description),
    dateDisplay: str(raw.creation_date),
    mediumDisplay: str(raw.technique),
    dimensions: str(raw.dimensions),
    department: str(raw.department),
    origin: normalizeOrigin(raw.culture),
    creditLine: str(raw.creditline),
    artworkType: str(raw.type),
    description: str(raw.description) ?? str(raw.tombstone),
    imageUrl: str(raw.images?.web?.url),
    isPublicDomain: raw.share_license_status === 'CC0',
    pageUrl: str(raw.url),
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(
      'We could not reach the collection. Check your connection and try again.',
      undefined,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status === 404
        ? 'That work is no longer in the collection.'
        : 'The collection is unavailable right now.',
      response.status,
    );
  }

  return (await response.json()) as T;
}

function feedParams(filter: FeedFilter, page: number): URLSearchParams {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((page - 1) * PAGE_SIZE),
    has_image: '1',
    cc0: '1',
  });
  if (filter.type) params.set('type', filter.type);
  if (filter.query) params.set('q', filter.query);
  return params;
}

export async function fetchFeed(
  filter: FeedFilter,
  page: number,
  signal?: AbortSignal,
): Promise<FeedPage> {
  const json = await request<{ data: RawArtwork[]; info?: { total?: number } }>(
    `${API_ROOT}/artworks/?${feedParams(filter, page).toString()}`,
    { signal },
  );
  const items = (json.data ?? []).map(normalizeArtwork);
  const total = json.info?.total ?? items.length;
  return {
    items,
    total,
    page,
    hasMore: (page - 1) * PAGE_SIZE + items.length < total,
  };
}

export async function fetchArtwork(id: number, signal?: AbortSignal): Promise<Artwork> {
  const json = await request<{ data: RawArtwork }>(`${API_ROOT}/artworks/${id}`, { signal });
  return normalizeArtwork(json.data);
}

export async function fetchRelated(
  artistName: string,
  excludeId: number,
  limit = 8,
  signal?: AbortSignal,
): Promise<Artwork[]> {
  const params = new URLSearchParams({
    limit: String(limit + 1),
    has_image: '1',
    cc0: '1',
    artists: artistName,
  });
  const json = await request<{ data: RawArtwork[] }>(
    `${API_ROOT}/artworks/?${params.toString()}`,
    { signal },
  );
  return (json.data ?? [])
    .map(normalizeArtwork)
    .filter((work) => work.id !== excludeId)
    .slice(0, limit);
}
