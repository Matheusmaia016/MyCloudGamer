import type { Session } from '@/types/entities';

export const mockSessions: Session[] = [
  {
    id: 's1',
    gameId: '1',
    gameTitle: 'Cyber Sprint 2077',
    hostId: 'host-main',
    startedAt: '2026-03-30T19:00:00Z',
    endedAt: '2026-03-30T21:10:00Z',
    status: 'completed',
  },
  {
    id: 's2',
    gameId: '3',
    gameTitle: 'Skyline Drift',
    hostId: 'host-main',
    startedAt: '2026-03-28T10:15:00Z',
    endedAt: '2026-03-28T11:05:00Z',
    status: 'completed',
  },
];
