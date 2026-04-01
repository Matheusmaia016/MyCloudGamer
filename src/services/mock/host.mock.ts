import type { ConnectionDiagnostics } from '@/types/entities';

import { mockHosts } from '@/mocks/hosts';
import { delay } from '@/utils/delay';

export const fetchHostsMock = async () => {
  await delay(300);
  return mockHosts;
};

export const runDiagnosticsMock = async (): Promise<ConnectionDiagnostics> => {
  await delay(800);
  return {
    pingMs: 24,
    jitterMs: 7,
    packetLossPercent: 0.4,
    recommendedProfile: 'balanced',
  };
};
