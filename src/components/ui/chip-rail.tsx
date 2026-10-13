import { ScrollView, StyleSheet, Text } from 'react-native';

import { Tappable } from '@/components/ui/tappable';
import { radius, spacing, type, useAppTheme } from '@/theme';

export type ChipOption = { label: string; value: string };

type ChipRailProps = {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
};

/** Horizontal, rectangular filter rail — placard styling rather than pill soup. */
export function ChipRail({ options, value, onChange }: ChipRailProps) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Tappable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            scaleTo={0.95}
            onPress={() => onChange(option.value)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.accent : 'transparent',
                borderColor: active ? colors.accent : colors.lineStrong,
              },
            ]}>
            <Text
              style={[
                styles.label,
                { color: active ? colors.accentInk : colors.inkSoft },
              ]}>
              {option.label}
            </Text>
          </Tappable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    height: 38,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.micro,
    fontSize: 11,
  },
});
