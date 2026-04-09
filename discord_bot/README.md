# Bot Discord para automação semanal do Speak (Sala do Futuro)

Bot em **Python 3.11+** usando **discord.py 2.x**, **Playwright** e **SQLite criptografado** para automatizar a execução das lições semanais do Speak (antiga EF) da Sala do Futuro.

> ⚠️ Aviso importante: automações podem violar termos de uso da plataforma. Use por sua conta e risco e priorize uso educacional responsável.

## Funcionalidades implementadas

- `/setup` (modal privado) para salvar login e senha por usuário no banco.
- `!setup` (prefixo) orientando para uso seguro do slash command.
- `/fazer_licoes` para execução manual imediata (entra em fila).
- `!fazer_licoes` (prefixo) orientando para slash command.
- `/status` para consultar se há credenciais e última execução.
- `/remover` para apagar credenciais do usuário.
- `/config_logs` (admin) para canal de logs.
- Agendamento automático toda segunda-feira às **08:00 (America/Sao_Paulo)**.
- Fila única de execução para evitar múltiplas automações ao mesmo tempo.
- Screenshots dos passos principais enviados por DM ao usuário.
- Tratamento de erros (login inválido, CAPTCHA, timeout etc.).

## Estrutura do projeto

```bash
discord_bot/
├── bot.py
├── automation.py
├── config.py
├── database.py
├── security.py
├── queue_manager.py
├── requirements.txt
├── .env.example
├── cogs/
│   ├── __init__.py
│   ├── user_commands.py
│   └── admin_commands.py
└── temp_screenshots/
```

## Instalação

1. Entre na pasta e crie ambiente virtual:

```bash
cd discord_bot
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate  # Windows
```

2. Instale dependências:

```bash
pip install -r requirements.txt
```

3. Instale navegador do Playwright:

```bash
python -m playwright install chromium
```

4. Configure variáveis:

```bash
cp .env.example .env
# edite DISCORD_TOKEN no .env
```

5. Rode o bot:

```bash
python bot.py
```

## Deploy (Railway, Render, VPS)

- Configure Python 3.11+.
- Defina variáveis de ambiente (`DISCORD_TOKEN`, etc.).
- Comando de build recomendado:
  - `pip install -r discord_bot/requirements.txt && python -m playwright install chromium`
- Comando de start:
  - `python discord_bot/bot.py`

## Segurança

- Senhas são criptografadas com **Fernet (cryptography)**.
- Chave é gerada no servidor (`.secret.key`) e nunca deve ser versionada.
- Use permissões mínimas no bot Discord.
- Prefira usar slash commands em vez de mensagens públicas com senha.

## Limitações conhecidas

- A UI da Sala do Futuro/Speak pode mudar e quebrar seletores.
- Fluxos de speaking/listening são tratados com estratégia mínima de avanço.
- Se houver CAPTCHA, o bot interrompe a execução com mensagem clara.

## Próximas melhorias sugeridas

- Melhorar parser de atividades com detecção por tipo real da questão.
- Persistir histórico detalhado por atividade em tabela própria.
- Suporte a retries automáticos e backoff.
- Painel web para administração de usuários e logs.
