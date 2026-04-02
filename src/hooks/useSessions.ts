import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { sessionService } from '@/services/sessionService';

export const useSessions = () => {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({ queryKey: queryKeys.sessions, queryFn: sessionService.listHistory });

  const startSessionMutation = useMutation({
    mutationFn: ({ gameId, hostId }: { gameId: string; hostId: string }) => sessionService.startGameSession(gameId, hostId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });

  return {
    ...historyQuery,
    startGameSession: startSessionMutation.mutateAsync,
    sessionStarting: startSessionMutation.isPending,
    sessionStartError: startSessionMutation.error,
  };
};
