# GameMirror Host Agent (PC real)

Agente desktop (Node.js + TypeScript) para rodar no computador real do usuário e preparar integração com Sunshine.

## O que ele faz
- registra host no backend com `PAIRING_CODE`
- envia heartbeat periódico
- detecta jogos por diretórios configuráveis
- envia biblioteca ao backend
- recebe comando `/session/remote-start`
- executa jogo local por caminho configurado
- prepara sessão para Sunshine (abstração)
- publica status de sessão para backend

## Variáveis de ambiente
- `BACKEND_URL`
- `PAIRING_CODE`
- `HOST_UNIQUE_KEY`
- `GAME_SCAN_DIRS` (ex.: `C:/Games;D:/SteamLibrary`)
- `GAME_EXTENSIONS` (ex.: `.exe;.lnk`)

## Rodar no PC real
```bash
cd host-agent
cp .env.example .env
npm install
npm run dev
```

## Próxima etapa Sunshine/Moonlight
- Implementar no `SunshineService`:
  - descoberta/registro de appId no Sunshine
  - start/stop real do stream
  - telemetria de encoder
- No mobile, manter abertura por `moonlight://...` com fallback de instruções.
