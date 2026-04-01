export type HostStatus = 'online' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Host {
  id: string;
  name: string;
  status: HostStatus;
  latencyMs: number;
}

export interface Game {
  id: string;
  title: string;
  genre: string;
  image: string;
  rating: number;
  playtimeHours: number;
  lastPlayedAt?: string;
  isFavorite?: boolean;
}

export interface Session {
  id: string;
  gameId: string;
  gameTitle: string;
  hostId: string;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'completed' | 'failed';
}

export interface QualitySettings {
  bitrateKbps: number;
  resolution: '720p' | '1080p' | '1440p';
  fps: 30 | 60 | 120;
}

export interface ConnectionDiagnostics {
  pingMs: number;
  jitterMs: number;
  packetLossPercent: number;
  recommendedProfile: 'performance' | 'balanced' | 'quality';
}
