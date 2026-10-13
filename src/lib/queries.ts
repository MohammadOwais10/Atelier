import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchArtwork, fetchFeed, fetchRelated, type FeedFilter } from '@/lib/api';

export const queryKeys = {
  feed: (filter: FeedFilter) => ['feed', filter.type ?? 'all', filter.query ?? ''] as const,
  artwork: (id: number) => ['artwork', id] as const,
  related: (artistName: string, excludeId: number) => ['related', artistName, excludeId] as const,
};

export function useFeed(filter: FeedFilter) {
  return useInfiniteQuery({
    queryKey: queryKeys.feed(filter),
    queryFn: ({ pageParam, signal }) => fetchFeed(filter, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    staleTime: 5 * 60_000,
  });
}

export function useArtwork(id: number) {
  return useQuery({
    queryKey: queryKeys.artwork(id),
    queryFn: ({ signal }) => fetchArtwork(id, signal),
    staleTime: 30 * 60_000,
  });
}

export function useRelated(artistName: string | null, excludeId: number) {
  return useQuery({
    queryKey: queryKeys.related(artistName ?? '', excludeId),
    queryFn: ({ signal }) => fetchRelated(artistName as string, excludeId, 8, signal),
    enabled: artistName != null,
    staleTime: 30 * 60_000,
  });
}
