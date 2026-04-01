# GameMirror Backend

Backend leve de orquestração para autenticação, hosts, pareamento, biblioteca, favoritos, sessões e presença em tempo real.

## Stack
- Node.js
- Fastify
- TypeScript
- PostgreSQL
- Prisma
- WebSocket
- JWT
- Zod

## Recursos implementados
- Cadastro, login e refresh token
- Usuário autenticado (`/users/me`)
- Registro/listagem de dispositivos mobile
- Pareamento de host por código
- Heartbeat de host e presença online/offline
- Ingestão de biblioteca enviada pelo host-agent
- Ingestão de metadados do host-agent
- Catálogo de jogos
- Biblioteca do usuário
- Favoritos
- Início/finalização de sessão
- Histórico de sessões e última sessão
- Perfis de conexão (qualidade preferida)
- WebSocket para presença (`/ws/presence`)

## Como rodar localmente
1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure seu PostgreSQL e ajuste `DATABASE_URL`.
3. Instale dependências:
   ```bash
   npm install
   ```
4. Gere client Prisma e rode migração:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
5. Rode seed fake:
   ```bash
   npm run prisma:seed
   ```
6. Inicie servidor:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

## Rotas alinhadas com host-agent
- `POST /pairing/confirm`
- `POST /hosts/heartbeat`
- `POST /hosts/:hostId/device-info`
- `POST /hosts/:hostId/library`

## Fluxo WebSocket presença
- Cliente conecta em `ws://localhost:3333/ws/presence`
- Envia:
  ```json
  { "type": "subscribe.presence", "payload": { "userId": "<user-id>" } }
  ```
- Host agent envia heartbeats:
  ```json
  { "type": "host.heartbeat", "payload": { "hostId": "<host-id>", "latencyMs": 18 } }
  ```
