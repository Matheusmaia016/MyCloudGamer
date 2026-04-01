export interface HostInfo {
  id: string;
  name: string;
  os: string;
  uniqueKey: string;
  isOnline: boolean;
  lastSeenAt?: string;
}

export interface HostGame {
  id: string;
  title: string;
  genre: string;
  executablePath: string;
}

export interface SessionRequest {
  gameId: string;
  userId?: string;
}

export interface SessionState {
  id: string;
  gameId: string;
  status: 'starting' | 'active' | 'stopped' | 'failed';
  streamPlaceholderUrl: string;
  startedAt: string;
}
