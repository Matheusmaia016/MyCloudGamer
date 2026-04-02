import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';

export const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={styles.row}>
    <AppText variant="h3">{title}</AppText>
    {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    gap: 4,
  },
});
