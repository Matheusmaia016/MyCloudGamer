import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@gamemirror.app' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@gamemirror.app',
      passwordHash: '$2b$10$mockhashmockhashmockhashmockhashmockhashmockhash',
    },
  });

  const games = await Promise.all([
    prisma.game.upsert({ where: { id: 'game-cyber' }, update: {}, create: { id: 'game-cyber', title: 'Cyber Sprint 2077', genre: 'RPG', coverUrl: 'https://example.com/cyber.jpg' } }),
    prisma.game.upsert({ where: { id: 'game-shadow' }, update: {}, create: { id: 'game-shadow', title: 'Shadow Arena', genre: 'Action', coverUrl: 'https://example.com/shadow.jpg' } }),
    prisma.game.upsert({ where: { id: 'game-skyline' }, update: {}, create: { id: 'game-skyline', title: 'Skyline Drift', genre: 'Racing', coverUrl: 'https://example.com/skyline.jpg' } }),
  ]);

  const host = await prisma.hostDevice.upsert({
    where: { uniqueKey: 'host-main-key' },
    update: { isOnline: true, lastSeenAt: new Date() },
    create: {
      userId: user.id,
      name: 'PC Gamer Principal',
      os: 'Windows 11',
      uniqueKey: 'host-main-key',
      isOnline: true,
      lastSeenAt: new Date(),
    },
  });

  await Promise.all(
    games.map((game) =>
      prisma.userLibrary.upsert({
        where: { userId_gameId: { userId: user.id, gameId: game.id } },
        update: {},
        create: { userId: user.id, gameId: game.id },
      }),
    ),
  );

  await prisma.favorite.upsert({
    where: { userId_gameId: { userId: user.id, gameId: games[0].id } },
    update: {},
    create: { userId: user.id, gameId: games[0].id },
  });

  await prisma.connectionProfile.upsert({
    where: { id: 'profile-default' },
    update: {},
    create: {
      id: 'profile-default',
      userId: user.id,
      name: 'Balanced',
      bitrateKbps: 12000,
      resolution: '1080p',
      fps: 60,
      isDefault: true,
    },
  });

  console.log(`Seed concluído. user=${user.email} host=${host.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
