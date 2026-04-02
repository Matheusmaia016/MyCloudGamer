import fp from 'fastify-plugin';

interface WsMessage {
  type: string;
  payload: Record<string, unknown>;
}

interface SocketLike {
  send: (data: string) => void;
}

const userChannels = new Map<string, Set<SocketLike>>();

function send(socket: SocketLike, message: WsMessage) {
  socket.send(JSON.stringify(message));
}

declare module 'fastify' {
  interface FastifyInstance {
    websocketServer: {
      subscribeUser: (userId: string, socket: SocketLike) => void;
      unsubscribeUser: (userId: string, socket: SocketLike) => void;
      broadcastToUser: (userId: string, message: WsMessage) => void;
    };
  }
}

export const websocketRuntimePlugin = fp(async (app) => {
  app.decorate('websocketServer', {
    subscribeUser(userId, socket) {
      const set = userChannels.get(userId) ?? new Set<SocketLike>();
      set.add(socket);
      userChannels.set(userId, set);
    },
    unsubscribeUser(userId, socket) {
      const set = userChannels.get(userId);
      if (!set) return;
      set.delete(socket);
      if (set.size === 0) userChannels.delete(userId);
    },
    broadcastToUser(userId, message) {
      const sockets = userChannels.get(userId);
      if (!sockets) return;
      for (const socket of sockets) {
        send(socket, message);
      }
    },
  });
});
