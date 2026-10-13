import * as Haptics from 'expo-haptics';
import { useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { motion } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TappableProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Set to 1 to disable the press-in. */
  scaleTo?: number;
  haptic?: 'light' | 'medium' | 'none';
};

/** Pressable with a tactile scale-down and optional haptic feedback. */
export function Tappable({
  children,
  style,
  scaleTo = 0.97,
  haptic = 'light',
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: TappableProps) {
  const [pressed, setPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(
    () => ({ transform: [{ scale: withSpring(pressed ? scaleTo : 1, motion.spring) }] }),
    [pressed, scaleTo],
  );

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic !== 'none' && Platform.OS !== 'web') {
          Haptics.impactAsync(
            haptic === 'medium'
              ? Haptics.ImpactFeedbackStyle.Medium
              : Haptics.ImpactFeedbackStyle.Light,
          ).catch(() => {});
        }
        onPress?.(event);
      }}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
}
