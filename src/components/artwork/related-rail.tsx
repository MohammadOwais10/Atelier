import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArtworkImage } from '@/components/artwork/artwork-image';
import { Tappable } from '@/components/ui/tappable';
import type { Artwork } from '@/lib/api';
import { radius, spacing, type, useAppTheme } from '@/theme';

type RelatedRailProps = {
  heading: string;
  works: Artwork[];
  onPress: (work: Artwork) => void;
};

/** A horizontal vitrine of further works by the same hand. */
export function RelatedRail({ heading, works, onPress }: RelatedRailProps) {
  const { colors } = useAppTheme();
  if (works.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: colors.ink }]}>{heading}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.track}
        decelerationRate="fast"
        snapToInterval={172 + spacing.md}>
        {works.map((work) => (
          <Tappable key={work.id} onPress={() => onPress(work)} style={styles.item}>
            <ArtworkImage
              uri={work.imageUrl}
              style={[styles.plate, { backgroundColor: colors.surface }]}
            />
            <Text style={[styles.title, { color: colors.ink }]} numberOfLines={2}>
              {work.title}
            </Text>
            {work.dateDisplay && (
              <Text style={[styles.date, { color: colors.inkFaint }]} numberOfLines={1}>
                {work.dateDisplay}
              </Text>
            )}
          </Tappable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  heading: {
    ...type.heading,
  
  },
  track: {
    
    gap: spacing.md,
  },
  item: {
    width: 172,
    gap: spacing.sm,
  },
  plate: {
    width: 172,
    height: 214,
    borderRadius: radius.md,
  },
  title: {
    ...type.bodyStrong,
    fontFamily: type.heading.fontFamily,
    fontSize: 15,
    lineHeight: 19,
  },
  date: {
    ...type.meta,
    fontSize: 12,
  },
});
