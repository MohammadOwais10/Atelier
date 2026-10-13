import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { radius as radii, useAppTheme } from '@/theme';

type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
  radius?: number;
};

/**
 * A slow diagonal light-sweep across a muted block. Reads as "developing print"
 * rather than the usual pulsing grey box.
 */
export function Skeleton({ style, radius = radii.md }: SkeletonProps) {
  const { colors, isDark } = useAppTheme();
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [progress]);

  const sweep = useAnimatedStyle(() => ({
    transform: [{ translateX: -width + progress.value * width * 2 }],
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next > 0 && next !== width) setWidth(next);
  };

  const highlight = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.7)';

  return (
    <View
      onLayout={onLayout}
      style={[
        { backgroundColor: colors.line, borderRadius: radius, overflow: 'hidden' },
        style,
      ]}>
      {width > 0 && (
        <Animated.View style={[styles.sweep, { width }, sweep]}>
          <LinearGradient
            colors={['transparent', highlight, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
});
