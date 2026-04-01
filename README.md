# GameMirror Monorepo

Monorepo com três serviços principais:
- **mobile** (Expo + React Native)
- **backend** (Fastify + Prisma + PostgreSQL)
- **host-agent** (Node.js + TypeScript)

## Mobile (Expo + EAS)
### Configurações aplicadas
- `app.json` com:
  - identidade do app (`name`, `slug`, `scheme`, `version`)
  - identificador Android (`android.package = com.gamemirror.mobile`)
  - sem dependência de assets locais de imagem (ícone/splash/favicon removidos)
  - `expo-router` e typed routes
- `eas.json` com perfis:
  - `development` (apk interno)
  - `preview` (apk interno)
  - `production` (aab para Play Store)
- `package.json` com scripts de Expo e EAS.

## Pré-requisitos gerais
- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Conta Expo (para EAS): `npx expo login`

## Instalação
### 1) Mobile (raiz)
```bash
npm install
```

### 2) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 3) Host Agent
```bash
cd ../host-agent
cp .env.example .env
# defina PAIRING_CODE gerado pelo mobile/backend
npm install
```

## Execução em desenvolvimento
### Terminal 1 - backend
```bash
npm --prefix backend run dev
```

### Terminal 2 - host-agent
```bash
npm --prefix host-agent run dev
```

### Terminal 3 - mobile (Expo)
```bash
npm run start
# ou
npm run start:clear
```

## Build Android com EAS (mobile)
```bash
# login na conta Expo
npx expo login

# opcional: vincular projeto ao EAS (primeira vez)
# npx eas init

# build de desenvolvimento (apk)
npm run eas:build:dev

# build preview (apk)
npm run eas:build:preview

# build produção (aab)
npm run eas:build:prod
```

## Testes/Checks
```bash
npm run typecheck:mobile
npm run typecheck:backend
npm run typecheck:host-agent
npm run typecheck:all
```

## Contratos principais alinhados
- `POST /pairing/confirm`
- `POST /hosts/heartbeat`
- `POST /hosts/:hostId/device-info`
- `POST /hosts/:hostId/library`
- `GET /ws/presence`

## Observação
No ambiente atual do agente, o acesso ao npm registry está bloqueado (403), então a instalação local deve ser feita em ambiente com acesso externo.
