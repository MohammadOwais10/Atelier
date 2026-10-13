import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { radius, spacing, type, useAppTheme } from '@/theme';

type StateViewProps = {
  kicker: string;
  title: string;
  message: string;
  icon?: IconName;
  actionLabel?: string;
  actionIcon?: IconName;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function StateView({
  kicker,
  title,
  message,
  icon = 'alert',
  actionLabel,
  actionIcon = 'refresh',
  onAction,
  style,
}: StateViewProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.seal, { borderColor: colors.lineStrong }]}>
        <Icon name={icon} size={26} color={colors.accent} strokeWidth={1.4} />
      </View>
      <Text style={[styles.kicker, { color: colors.inkFaint }]}>{kicker}</Text>
      <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.inkSoft }]}>{message}</Text>
      {actionLabel && onAction && (
        <Button label={actionLabel} icon={actionIcon} onPress={onAction} style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
    gap: spacing.md,
  },
  seal: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  kicker: {
    ...type.marker,
    textTransform: 'uppercase',
  },
  title: {
    ...type.title,
    textAlign: 'center',
    maxWidth: 340,
  },
  message: {
    ...type.caption,
    textAlign: 'center',
    maxWidth: 320,
  },
  action: {
    marginTop: spacing.md,
    minWidth: 180,
  },
});
