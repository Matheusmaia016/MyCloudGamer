# GameMirror Backend

Backend de orquestração para autenticação, hosts, pareamento, biblioteca, sessões e presença em tempo real.

## Endpoints principais para integração Sunshine/Moonlight
- `POST /hosts/register`
- `POST /hosts/heartbeat`
- `POST /hosts/:hostId/library`
- `GET /hosts/:hostId/games`
- `POST /sessions/start`
- `POST /sessions/:id/status`
- `GET /ws/presence`

## Como rodar localmente
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Fluxo de orquestração (sem codec próprio)
1. Mobile chama `POST /sessions/start`.
2. Backend valida host online e jogo.
3. Backend cria sessão e retorna `stream.moonlightUri` + instruções.
4. Backend chama `HOST_AGENT_URL/session/remote-start`.
5. Host-agent envia `session.status.updated`.
6. Mobile recebe status por websocket e tenta abrir Moonlight por URI.
