import type { Game } from '@/types/entities';

export const mockGames: Game[] = [
  { id: '1', title: 'Cyber Sprint 2077', genre: 'RPG', image: '🎮', rating: 4.8, playtimeHours: 32, isFavorite: true, lastPlayedAt: '2026-03-30T19:00:00Z' },
  { id: '2', title: 'Shadow Arena', genre: 'Action', image: '⚔️', rating: 4.6, playtimeHours: 88, isFavorite: false, lastPlayedAt: '2026-03-29T21:00:00Z' },
  { id: '3', title: 'Skyline Drift', genre: 'Racing', image: '🏎️', rating: 4.5, playtimeHours: 12, isFavorite: true, lastPlayedAt: '2026-03-27T16:20:00Z' },
  { id: '4', title: 'Nebula Ops', genre: 'Shooter', image: '🚀', rating: 4.7, playtimeHours: 54, isFavorite: false },
  { id: '5', title: 'Mystic Realms', genre: 'MMO', image: '🧙', rating: 4.9, playtimeHours: 147, isFavorite: true },
  { id: '6', title: 'Dungeon Echoes', genre: 'Roguelike', image: '🕳️', rating: 4.4, playtimeHours: 23, isFavorite: false },
];
