import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { fetchSessionsMock } from '@/services/mock/session.mock';

export const useSessions = () => useQuery({ queryKey: queryKeys.sessions, queryFn: fetchSessionsMock });
