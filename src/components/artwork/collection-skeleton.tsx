import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { radius, spacing } from '@/theme';

export function HeroSkeleton() {
  return (
    <View style={styles.heroWrap}>
      <Skeleton radius={20} style={styles.hero} />
    </View>
  );
}

export function ArtworkCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.markerRow}>
        <Skeleton radius={radius.xs} style={{ width: 26, height: 10 }} />
        <Skeleton radius={radius.xs} style={{ flex: 1, height: 1, opacity: 0.6 }} />
      </View>
      <Skeleton radius={radius.md} style={styles.plate} />
      <View style={styles.caption}>
        <Skeleton radius={radius.xs} style={{ width: '78%', height: 16 }} />
        <Skeleton radius={radius.xs} style={{ width: '52%', height: 16 }} />
        <Skeleton radius={radius.xs} style={{ width: '34%', height: 11, marginTop: 4 }} />
      </View>
    </View>
  );
}

export function CollectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View>
      <HeroSkeleton />
      {Array.from({ length: count }).map((_, index) => (
        <ArtworkCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    paddingHorizontal: spacing.lg,
  },
  hero: {
    width: '100%',
    aspectRatio: 0.82,
  },
  card: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  markerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  plate: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  caption: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
