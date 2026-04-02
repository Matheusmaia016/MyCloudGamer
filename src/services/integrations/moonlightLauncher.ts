import { Linking, Platform } from 'react-native';

export const moonlightLauncher = {
  async open(moonlightUri: string): Promise<{ opened: boolean; reason?: string }> {
    const can = await Linking.canOpenURL(moonlightUri);
    if (!can) {
      return {
        opened: false,
        reason: Platform.OS === 'android' ? 'Moonlight não encontrado no dispositivo.' : 'Moonlight não disponível para abertura.',
      };
    }

    await Linking.openURL(moonlightUri);
    return { opened: true };
  },
};
