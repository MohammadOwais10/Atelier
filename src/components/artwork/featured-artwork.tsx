import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { ArtworkImage } from '@/components/artwork/artwork-image';
import { Icon } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import type { Artwork } from '@/lib/api';
import { fonts, spacing, type } from '@/theme';

type FeaturedArtworkProps = {
  work: Artwork;
  onPress: () => void;
};

/** Full-bleed, magazine-cover treatment for the lead work in the feed. */
export function FeaturedArtwork({ work, onPress }: FeaturedArtworkProps) {
  const artist = work.artistName;
  const category = (work.artworkType ?? 'Artwork').toUpperCase();

  return (
    <Tappable onPress={onPress} scaleTo={0.985} style={styles.wrap}>
      <View style={styles.frame}>
        <ArtworkImage uri={work.imageUrl} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(8,7,5,0.28)', 'transparent', 'rgba(8,7,5,0.05)', 'rgba(8,7,5,0.86)']}
          locations={[0, 0.32, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.top}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Currently featured</Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.kicker}>{category}</Text>
          <Text style={styles.title} numberOfLines={3}>
            {work.title}
          </Text>
          {artist && <Text style={styles.artist}>{artist}</Text>}
          <View style={styles.cta}>
            <Text style={styles.ctaText}>View the work</Text>
            <Icon name="arrowUpRight" size={15} color="#FFFFFF" strokeWidth={1.8} />
          </View>
        </View>
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
  },
  frame: {
    aspectRatio: 0.82,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0B0906',
  },
  top: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(10,8,6,0.42)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  pillText: {
    ...type.marker,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  bottom: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: spacing.xs,
  },
  kicker: {
    ...type.marker,
    color: 'rgba(255,255,255,0.72)',
  },
  title: {
    ...type.hero,
    fontSize: 40,
    lineHeight: 41,
    color: '#FFFFFF',
  },
  artist: {
    ...type.bodyStrong,
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  ctaText: {
    ...type.micro,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
