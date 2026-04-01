import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { fetchHostsMock } from '@/services/mock/host.mock';

export const useHosts = () => useQuery({ queryKey: queryKeys.hosts, queryFn: fetchHostsMock, refetchInterval: 7000 });
