# GameMirror Host Agent

Agente desktop (Node.js + TypeScript) para autenticar host, parear com conta do usuário, enviar heartbeat e biblioteca mock, e preparar futura integração com streaming (Sunshine).

## Funcionalidades
- Login/registro do host via backend (pareamento por código)
- Heartbeat periódico para presença online/offline
- Publicação de biblioteca mock de jogos
- Envio de metadados do dispositivo host
- Serviço HTTP local para iniciar sessão mock
- Logs estruturados e claros
- Configuração por `.env`

## Estrutura
- `src/config`: leitura e validação de ambiente
- `src/logger`: logger central
- `src/api`: cliente HTTP do backend
- `src/auth`: fluxo de pareamento/registro do host
- `src/heartbeat`: loop de heartbeat
- `src/games`: coleta e envio da biblioteca mock
- `src/session`: serviço local para sessão mock
- `src/services`: orquestração principal do agente

## Como rodar
1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure `BACKEND_URL` e (opcionalmente) `PAIRING_CODE`.
3. Instale dependências:
   ```bash
   npm install
   ```
4. Execute em modo desenvolvimento:
   ```bash
   npm run dev
   ```

## Endpoints locais do agente
- `GET /health`
- `POST /session/start` (mock)
- `POST /session/stop` (mock)

## Sunshine (futuro)
A base já inclui camada de sessão (`session`) e serviço de games (`games`) para futura substituição da lógica mock por integração real com Sunshine (detecção de jogos, start/stop stream e status de encoder).
