import { useAuthStore } from '@/store/authStore';
import { useSessionStore } from '@/store/sessionStore';

let socket: WebSocket | null = null;

export const sessionRealtime = {
  connect() {
    if (socket) return;

    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333';
    const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    socket = new WebSocket(`${wsUrl}/ws/presence`);

    socket.onopen = () => {
      socket?.send(JSON.stringify({ type: 'subscribe.presence', payload: { userId } }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as { type?: string; payload?: { sessionId?: string; status?: string } };
        if (data.type === 'session.status.updated' && data.payload?.sessionId) {
          const currentId = useSessionStore.getState().currentSessionId;
          if (currentId === data.payload.sessionId && data.payload.status) {
            const mapped = data.payload.status as 'starting' | 'preparing_host' | 'connecting' | 'ready' | 'error';
            useSessionStore.getState().updateStatus(mapped);
          }
        }
      } catch {
        // noop
      }
    };

    socket.onclose = () => {
      socket = null;
    };
  },
  disconnect() {
    socket?.close();
    socket = null;
  },
};
