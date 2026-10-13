import { StyleSheet, Text, View } from 'react-native';

import { spacing, type, useAppTheme } from '@/theme';

export type MetaRow = { label: string; value: string };

/** Ruled, two-column catalogue data. Empty rows are filtered by the caller. */
export function MetaGrid({ rows }: { rows: MetaRow[] }) {
  const { colors } = useAppTheme();
  if (rows.length === 0) return null;

  return (
    <View>
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={[
            styles.row,
            { borderTopColor: colors.line },
            index === rows.length - 1 && { borderBottomColor: colors.line, borderBottomWidth: StyleSheet.hairlineWidth },
          ]}>
          <Text style={[styles.label, { color: colors.inkFaint }]}>{row.label}</Text>
          <Text style={[styles.value, { color: colors.ink }]}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.lg,
  },
  label: {
    ...type.marker,
    width: 92,
    paddingTop: 3,
  },
  value: {
    ...type.caption,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
});
