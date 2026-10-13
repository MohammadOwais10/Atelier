import { StyleSheet, Text, View } from 'react-native';

import { ArtworkImage } from '@/components/artwork/artwork-image';
import { Tappable } from '@/components/ui/tappable';
import type { Artwork } from '@/lib/api';
import { ordinal } from '@/lib/format';
import { radius, spacing, type, useAppTheme } from '@/theme';

type ArtworkCardProps = {
  work: Artwork;
  /** Position in the feed, used for the catalogue number. */
  index: number;
  onPress: () => void;
};

/**
 * Catalogue entry: numbered marker rule, portrait plate, then a serif title with
 * an italic attribution line. Deliberately text-forward rather than a card grid.
 */
export function ArtworkCard({ work, index, onPress }: ArtworkCardProps) {
  const { colors } = useAppTheme();
  const artist = work.artistName;
  const category = (work.artworkType ?? '').toUpperCase();

  return (
    <Tappable onPress={onPress} scaleTo={0.985} style={styles.wrap}>
      <View style={[styles.markerRow]}>
        <Text style={[styles.index, { color: colors.accent }]}>{ordinal(index)}</Text>
        <View style={[styles.rule, { backgroundColor: colors.line }]} />
        {category.length > 0 && (
          <Text style={[styles.category, { color: colors.inkFaint }]}>{category}</Text>
        )}
      </View>

      <ArtworkImage
        uri={work.imageUrl}
        style={[styles.plate, { backgroundColor: colors.surface }]}
      />

      <View style={styles.caption}>
        <Text style={[styles.title, { color: colors.ink }]} numberOfLines={3}>
          {work.title}
        </Text>
        {artist && (
          <Text style={[styles.artist, { color: colors.inkSoft }]} numberOfLines={1}>
            {artist}
          </Text>
        )}
        {work.dateDisplay && (
          <Text style={[styles.date, { color: colors.inkFaint }]} numberOfLines={1}>
            {work.dateDisplay}
          </Text>
        )}
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  markerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  index: {
    ...type.marker,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
  },
  category: {
    ...type.marker,
  },
  plate: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
  },
  caption: {
    marginTop: spacing.md,
    gap: 3,
  },
  title: {
    ...type.heading,
    fontSize: 21,
    lineHeight: 25,
  },
  artist: {
    ...type.italic,
    fontSize: 16,
    lineHeight: 22,
  },
  date: {
    ...type.meta,
    fontSize: 12.5,
  },
});
