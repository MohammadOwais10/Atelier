import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Tappable } from '@/components/ui/tappable';
import { fonts, radius, spacing, type, useAppTheme } from '@/theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: IconName;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'quiet';
  style?: StyleProp<ViewStyle>;
};

/**
 * Rectangular, tight-cornered buttons with a letterspaced label — closer to a
 * gallery wall placard than a rounded app pill.
 */
export function Button({
  label,
  onPress,
  icon,
  loading = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const { colors } = useAppTheme();

  const palette = {
    primary: { bg: colors.accent, fg: colors.accentInk, border: 'transparent' },
    outline: { bg: 'transparent', fg: colors.ink, border: colors.lineStrong },
    quiet: { bg: colors.surface, fg: colors.ink, border: 'transparent' },
  }[variant];

  return (
    <Tappable
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading}
      style={[
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        style,
      ]}>
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" color={palette.fg} />
        ) : (
          icon && <Icon name={icon} size={16} color={palette.fg} strokeWidth={1.7} />
        )}
        <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...type.micro,
    fontFamily: fonts.sansBold,
    fontSize: 11,
  },
});
