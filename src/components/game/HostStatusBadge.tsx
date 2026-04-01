import { StyleSheet, View } from 'react-native';

import type { HostStatus } from '@/types/entities';
import { theme } from '@/theme';

import { AppText } from '../ui/AppText';

export const HostStatusBadge = ({ status }: { status: HostStatus }) => {
  const online = status === 'online';
  return (
    <View style={[styles.badge, online ? styles.online : styles.offline]}>
      <AppText variant="caption" style={styles.label}>
        {online ? 'Host online' : 'Host offline'}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  online: {
    backgroundColor: 'rgba(35,199,126,0.2)',
  },
  offline: {
    backgroundColor: 'rgba(255,107,122,0.2)',
  },
  label: {
    color: theme.colors.textPrimary,
  },
});
