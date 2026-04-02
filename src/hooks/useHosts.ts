import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { hostService } from '@/services/hostService';

export const useHosts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: queryKeys.hosts, queryFn: hostService.listHosts, refetchInterval: 7000 });
  const pairMutation = useMutation({
    mutationFn: (code: string) => hostService.pairHost(code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.hosts });
    },
  });

  return {
    ...query,
    pairHost: pairMutation.mutateAsync,
    pairing: pairMutation.isPending,
    pairError: pairMutation.error,
  };
};
