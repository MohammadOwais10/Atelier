import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Share, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArtworkImage } from '@/components/artwork/artwork-image';
import { MetaGrid, type MetaRow } from '@/components/artwork/meta-grid';
import { RelatedRail } from '@/components/artwork/related-rail';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { StateView } from '@/components/ui/state-view';
import { Tappable } from '@/components/ui/tappable';
import type { Artwork } from '@/lib/api';
import { toParagraphs } from '@/lib/format';
import { useArtwork, useRelated } from '@/lib/queries';
import { radius, spacing, type, useAppTheme } from '@/theme';

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { width, height } = useWindowDimensions();

  const heroHeight = Math.round(Math.min(width * 1.2, height * 0.62));
  const slack = heroHeight * 0.15;
  const barThreshold = heroHeight - 60;

  // Over the dark hero the bar needs light glyphs; once the opaque header
  // scrolls in it should follow the theme again.
  const [headerOpaque, setHeaderOpaque] = useState(false);

  const query = useArtwork(numericId);
  const work = query.data;
  const related = useRelated(work?.artistName ?? null, work?.id ?? numericId);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  useAnimatedReaction(
    () => scrollY.value > barThreshold,
    (opaque, previous) => {
      if (opaque !== previous) runOnJS(setHeaderOpaque)(opaque);
    },
  );

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, heroHeight], [0, slack], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-heroHeight, 0], [1.35, 1], Extrapolation.CLAMP) },
    ],
  }));

  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [heroHeight - 90, heroHeight - 20], [0, 1], Extrapolation.CLAMP),
  }));

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const share = async () => {
    if (!work) return;
    const url = work.pageUrl ?? `https://clevelandart.org/art/${work.accessionNumber ?? work.id}`;
    const author = work.artistName;
    await Share.share({
      message: `${work.title}${author ? ` — ${author}` : ''}\n${url}`,
      url,
      title: work.title,
    }).catch(() => {});
  };

  if (query.isError) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.canvas }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <StateView
          kicker="Not available"
          title="This work is out of view"
          message={
            query.error instanceof Error
              ? query.error.message
              : 'We could not load the details for this work.'
          }
          actionLabel="Try again"
          onAction={() => query.refetch()}
        />
        <View style={[styles.floating, { top: insets.top + spacing.xs }]}>
          <GlassButton
            icon="chevronLeft"
            label="Go back"
            onPress={goBack}
            backgroundColor={colors.scrim}
            borderColor="rgba(255,255,255,0.24)"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.canvas }]}>
      <StatusBar style={!headerOpaque || isDark ? 'light' : 'dark'} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.huge }}>
        <View style={[styles.hero, { height: heroHeight }]}>
          {work && (
            <Animated.View style={[styles.heroImage, { height: heroHeight }, heroStyle]}>
              <ArtworkImage
                uri={work.imageUrl}
                contentFit="cover"
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          )}
          <LinearGradient
            colors={['rgba(6,5,3,0.55)', 'transparent']}
            style={styles.topScrim}
          />
        </View>

        {query.isPending && <DetailSkeleton />}

        {work && (
          <View style={[styles.sheet, { backgroundColor: colors.canvas }]}>
            <Category work={work} />

            <Text style={[styles.title, { color: colors.ink }]}>{work.title}</Text>

            {(work.artistName || work.artistMeta) && (
              <View style={styles.artistBlock}>
                {work.artistName && (
                  <Text style={[styles.artist, { color: colors.ink }]}>{work.artistName}</Text>
                )}
                {work.artistMeta && (
                  <Text style={[styles.artistMeta, { color: colors.inkFaint }]}>
                    {work.artistMeta}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.block}>
              <MetaGrid rows={buildMetaRows(work)} />
            </View>

            <Description work={work} />

            {work.artistName != null && (
              <View style={styles.block}>
                <RelatedRail
                  heading={`More by ${work.artistName}`}
                  works={related.data ?? []}
                  onPress={(item) =>
                    router.push({ pathname: '/artwork/[id]', params: { id: String(item.id) } })
                  }
                />
              </View>
            )}

            <View style={[styles.attribution, { borderTopColor: colors.line }]}>
              {work.isPublicDomain && (
                <Text style={[styles.publicDomain, { color: colors.accent }]}>
                  PUBLIC DOMAIN · CC0
                </Text>
              )}
              <Text style={[styles.credit, { color: colors.inkFaint }]}>
                Data and images courtesy of the Cleveland Museum of Art.
              </Text>
              
            </View>
          </View>
        )}
      </Animated.ScrollView>

      <View style={[styles.floating, { top: insets.top + spacing.xs }]}>
        <GlassButton
          icon="chevronLeft"
          label="Go back"
          onPress={goBack}
          backgroundColor={colors.scrim}
          borderColor="rgba(255,255,255,0.24)"
        />
        <GlassButton
          icon="share"
          label="Share"
          onPress={share}
          backgroundColor={colors.scrim}
          borderColor="rgba(255,255,255,0.24)"
        />
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.compactBar,
          barStyle,
          { paddingTop: insets.top, backgroundColor: colors.canvas, borderBottomColor: colors.line },
        ]}>
        <View style={styles.compactInner}>
          <Text style={[styles.compactTitle, { color: colors.ink }]} numberOfLines={1}>
            {work?.title ?? ''}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

function Category({ work }: { work: Artwork }) {
  const { colors } = useAppTheme();
  const label = work.artworkType;
  if (!label) return null;
  return <Text style={[styles.kicker, { color: colors.accent }]}>{label.toUpperCase()}</Text>;
}

function Description({ work }: { work: Artwork }) {
  const { colors } = useAppTheme();
  const paragraphs = toParagraphs(work.description);

  return (
    <View style={styles.block}>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>About this work</Text>
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <Text key={index} style={[styles.paragraph, { color: colors.inkSoft }]}>
            {paragraph}
          </Text>
        ))
      ) : (
        <Text style={[styles.paragraph, { color: colors.inkFaint, fontStyle: 'italic' }]}>
          The museum has not published a description for this work yet.
        </Text>
      )}
    </View>
  );
}

function DetailSkeleton() {
  return (
    <View style={[styles.sheet, { backgroundColor: 'transparent' }]}>
      <Skeleton style={{ width: 90, height: 11 }} />
      <Skeleton style={{ width: '85%', height: 30, marginTop: spacing.md }} />
      <Skeleton style={{ width: '40%', height: 16, marginTop: spacing.md }} />
      <View style={{ marginTop: spacing.xxl, gap: spacing.lg }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} style={{ width: `${90 - index * 10}%`, height: 14 }} />
        ))}
      </View>
    </View>
  );
}

function GlassButton({
  icon,
  label,
  onPress,
  backgroundColor,
  borderColor,
}: {
  icon: 'chevronLeft' | 'share';
  label: string;
  onPress: () => void;
  backgroundColor: string;
  borderColor: string;
}) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.9}
      haptic="light"
      style={[styles.glassButton, { backgroundColor, borderColor }]}>
      <Icon name={icon} size={19} color="#FFFFFF" strokeWidth={1.7} />
    </Tappable>
  );
}

function buildMetaRows(work: Artwork): MetaRow[] {
  const rows: MetaRow[] = [];
  const add = (label: string, value: string | null) => {
    if (value) rows.push({ label, value });
  };
  add('DATE', work.dateDisplay);
  add('MEDIUM', work.mediumDisplay);
  add('DIMENSIONS', work.dimensions);
  add('ORIGIN', work.origin);
  add('DEPARTMENT', work.department);
  add('TYPE', work.artworkType);
  add('ACCESSION', work.accessionNumber);
  add('CREDIT', work.creditLine);
  return rows;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hero: {
    overflow: 'hidden',
    backgroundColor: '#0B0906',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  kicker: {
    ...type.marker,
  },
  title: {
    ...type.display,
    fontSize: 32,
    lineHeight: 35,
  },
  artistBlock: {
    gap: 3,
    marginTop: spacing.xs,
  },
  artist: {
    ...type.italic,
    fontSize: 19,
    lineHeight: 25,
  },
  artistMeta: {
    ...type.meta,
    fontSize: 12.5,
  },
  block: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...type.heading,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...type.body,
    fontSize: 15.5,
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  attribution: {
    marginTop: spacing.xxxl,
    paddingTop: spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  publicDomain: {
    ...type.marker,
  },
  credit: {
    ...type.caption,
    fontSize: 12.5,
    maxWidth: 320,
  },
  siteButton: {
    alignSelf: 'flex-start',
    minWidth: 200,
    marginTop: spacing.xs,
  },
  floating: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTitle: {
    ...type.heading,
    fontSize: 16,
  },
});
