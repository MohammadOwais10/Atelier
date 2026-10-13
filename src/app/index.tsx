import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtworkCard } from '@/components/artwork/artwork-card';
import { CollectionSkeleton } from '@/components/artwork/collection-skeleton';
import { FeaturedArtwork } from '@/components/artwork/featured-artwork';
import { ChipRail } from '@/components/ui/chip-rail';
import { StateView } from '@/components/ui/state-view';
import type { Artwork, FeedFilter } from '@/lib/api';
import { pluralise } from '@/lib/format';
import { useFeed } from '@/lib/queries';
import { fonts, spacing, type, useAppTheme } from '@/theme';

const FILTERS = [
  { label: 'Highlights', value: 'all' },
  { label: 'Painting', value: 'Painting' },
  { label: 'Print', value: 'Print' },
  { label: 'Photograph', value: 'Photograph' },
  { label: 'Sculpture', value: 'Sculpture' },
  { label: 'Drawing', value: 'Drawing' },
  { label: 'Textile', value: 'Textile' },
];

export default function CollectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [selected, setSelected] = useState('all');

  const filter = useMemo<FeedFilter>(
    () => ({ type: selected === 'all' ? undefined : selected }),
    [selected],
  );
  const feed = useFeed(filter);

  const items = useMemo(
    () => feed.data?.pages.flatMap((page) => page.items) ?? [],
    [feed.data],
  );
  const total = feed.data?.pages[0]?.total ?? 0;
  const featured = items[0];
  const rest = useMemo(() => items.slice(1), [items]);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [140, 200], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, [140, 200], [-10, 0], Extrapolation.CLAMP) },
    ],
  }));

  const open = (id: number) =>
    router.push({ pathname: '/artwork/[id]', params: { id: String(id) } });

  const isInitialLoading = feed.isPending;
  const isFailing = feed.isError && items.length === 0;

  if (isFailing) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.canvas }]}>
        <Masthead topInset={insets.top} />
        <StateView
          kicker="Connection"
          title="The gallery is quiet"
          message={
            feed.error instanceof Error
              ? feed.error.message
              : 'Something went wrong loading the collection.'
          }
          actionLabel="Try again"
          onAction={() => feed.refetch()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas }]}>
      <Animated.FlatList
        data={isInitialLoading ? [] : rest}
        keyExtractor={(item: Artwork) => String(item.id)}
        renderItem={({ item, index }) => (
          <ArtworkCard work={item} index={index + 1} onPress={() => open(item.id)} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.huge }}
        refreshControl={
          <RefreshControl
            refreshing={feed.isRefetching && !feed.isFetchingNextPage}
            onRefresh={() => feed.refetch()}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.surface}
          />
        }
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (feed.hasNextPage && !feed.isFetchingNextPage) feed.fetchNextPage();
        }}
        ListHeaderComponent={
          <View>
            <Masthead topInset={insets.top} />

            {isInitialLoading && <CollectionSkeleton count={2} />}

            {!isInitialLoading && (
              <View>
                {featured && <FeaturedArtwork work={featured} onPress={() => open(featured.id)} />}

                <View style={styles.section}>
                  <View style={styles.sectionRow}>
                    <Text style={[styles.sectionTitle, { color: colors.ink }]}>
                      The Collection
                    </Text>
                    {total > 0 && (
                      <Text style={[styles.sectionCount, { color: colors.inkFaint }]}>
                        {pluralise(total, 'work')}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.sectionNote, { color: colors.inkSoft }]}>
                    Public-domain works, shown with the museum&rsquo;s own images.
                  </Text>
                </View>

                <ChipRail options={FILTERS} value={selected} onChange={setSelected} />

                {rest.length === 0 && (
                  <StateView
                    kicker="Empty"
                    title="Nothing in this room yet"
                    message="Try another medium from the filter above."
                    icon="info"
                    style={styles.emptyState}
                  />
                )}
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <FeedFooter
            loading={feed.isFetchingNextPage}
            showEnd={!feed.hasNextPage && items.length > 0}
          />
        }
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.compactBar,
          barStyle,
          {
            paddingTop: insets.top,
            backgroundColor: colors.canvas,
            borderBottomColor: colors.line,
          },
        ]}>
        <View style={styles.compactInner}>
          <Text style={[styles.compactWordmark, { color: colors.ink }]}>ATELIER</Text>
          <Text style={[styles.compactMeta, { color: colors.inkFaint }]}>
            {total > 0 ? pluralise(total, 'work') : ''}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

function Masthead({ topInset }: { topInset: number }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.masthead, { paddingTop: topInset + spacing.lg }]}>
      <View style={styles.mastheadRow}>
        <View style={styles.mastheadLeft}>
          <Text style={[styles.wordmark, { color: colors.ink }]}>ATELIER</Text>
          <Text style={[styles.tagline, { color: colors.inkSoft }]}>
            Selections from the Cleveland Museum of Art
          </Text>
        </View>
        <Text style={[styles.edition, { color: colors.inkFaint }]}>№ 01</Text>
      </View>
      <View style={[styles.hairline, { backgroundColor: colors.line }]} />
    </View>
  );
}

function FeedFooter({ loading, showEnd }: { loading: boolean; showEnd: boolean }) {
  const { colors } = useAppTheme();
  if (loading) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }
  if (!showEnd) return <View style={{ height: spacing.xl }} />;
  return (
    <View style={styles.footer}>
      <View style={[styles.endRule, { backgroundColor: colors.line }]} />
      <Text style={[styles.endText, { color: colors.inkFaint }]}>End of selection</Text>
      <View style={[styles.endRule, { backgroundColor: colors.line }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  masthead: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  mastheadRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  mastheadLeft: {
    flex: 1,
    gap: 6,
  },
  wordmark: {
    fontFamily: fonts.sansBold,
    fontSize: 17,
    letterSpacing: 6,
  },
  tagline: {
    ...type.italic,
    fontSize: 14.5,
    lineHeight: 20,
  },
  edition: {
    ...type.marker,
    paddingBottom: 3,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    marginTop: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    gap: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...type.title,
    fontSize: 24,
  },
  sectionCount: {
    ...type.marker,
  },
  sectionNote: {
    ...type.caption,
    fontSize: 13,
    maxWidth: 320,
  },
  emptyState: {
    flex: 0,
    minHeight: 280,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  endRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  endText: {
    ...type.marker,
  },
  compactBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  compactInner: {
    height: 48,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactWordmark: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    letterSpacing: 5,
  },
  compactMeta: {
    ...type.marker,
    fontSize: 9.5,
  },
});
