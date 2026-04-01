import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Game } from '@/types/entities';
import { theme } from '@/theme';

import { AppCard } from '../ui/AppCard';
import { AppText } from '../ui/AppText';

interface GameCardProps {
  game: Game;
  subtitle?: string;
}

export const GameCard = ({ game, subtitle }: GameCardProps) => {
  return (
    <Link asChild href={`/game/${game.id}`}>
      <Pressable>
        <AppCard>
          <View style={styles.header}>
            <AppText style={styles.emoji}>{game.image}</AppText>
            <View style={styles.meta}>
              <AppText variant="h3">{game.title}</AppText>
              <AppText variant="caption">{subtitle ?? `${game.genre} • ⭐ ${game.rating}`}</AppText>
            </View>
          </View>
        </AppCard>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
});
