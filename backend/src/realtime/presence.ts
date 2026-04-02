interface SocketLike {
  send: (data: string) => void;
}

const hostSockets = new Map<string, Set<SocketLike>>();

export const presenceStore = {
  markConnected(hostId: string, socket: SocketLike) {
    const set = hostSockets.get(hostId) ?? new Set<SocketLike>();
    set.add(socket);
    hostSockets.set(hostId, set);
  },
  markDisconnected(hostId: string, socket: SocketLike) {
    const set = hostSockets.get(hostId);
    if (!set) return;
    set.delete(socket);
    if (set.size === 0) hostSockets.delete(hostId);
  },
  isOnline(hostId: string) {
    return (hostSockets.get(hostId)?.size ?? 0) > 0;
  },
};
