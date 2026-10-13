import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StateView } from '@/components/ui/state-view';
import { useAppTheme } from '@/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StateView
          kicker="404"
          title="This room is empty"
          message="We could not find the page you were looking for."
          icon="info"
          actionLabel="Back to the collection"
          actionIcon="arrowUpRight"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    </View>
  );
}
