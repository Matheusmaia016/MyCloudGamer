import { mockSessions } from '@/mocks/sessions';
import { delay } from '@/utils/delay';

export const fetchSessionsMock = async () => {
  await delay(300);
  return mockSessions;
};

export const startSessionMock = async (gameId: string) => {
  await delay(1000);
  return {
    sessionId: `session-${Date.now()}`,
    gameId,
    streamUrl: 'wss://placeholder-stream.gamemirror.local',
  };
};
