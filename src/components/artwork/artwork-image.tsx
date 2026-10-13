import { Image } from 'expo-image';
import {
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/theme';

type ArtworkImageProps = {
  uri: string | null;
  /** Optional lower-resolution source shown while the full image decodes. */
  placeholderUri?: string | null;
  contentFit?: 'cover' | 'contain';
  style?: StyleProp<ViewStyle & ImageStyle>;
};

/**
 * CDN-backed image with an optional soft blur-up placeholder and a slow
 * cross-fade once the real pixels arrive. Renders a plain surface when the
 * work has no image.
 */
export function ArtworkImage({
  uri,
  placeholderUri,
  contentFit = 'cover',
  style,
}: ArtworkImageProps) {
  const { colors } = useAppTheme();

  if (!uri) {
    return <View style={[styles.fallback, { backgroundColor: colors.surface }, style]} />;
  }

  return (
    <Image
      source={{ uri }}
      placeholder={placeholderUri ? { uri: placeholderUri } : undefined}
      placeholderContentFit="cover"
      contentFit={contentFit}
      transition={{ duration: 420, effect: 'cross-dissolve' }}
      cachePolicy="memory-disk"
      recyclingKey={uri}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
