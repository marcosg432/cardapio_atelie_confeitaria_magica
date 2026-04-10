#!/usr/bin/env bash
# Executar NO SERVIDOR (Ubuntu), na pasta do projeto ou após clone.
# Uso: bash scripts/setup-vps.sh
set -euo pipefail

APP_NAME="cardapio-atelie-confeitaria-magica"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Pasta: $ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Instale Node.js 18+ (ex.: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs)"
  exit 1
fi

echo "==> Node $(node -v)"
npm ci --omit=dev

if command -v pm2 >/dev/null 2>&1; then
  pm2 delete "$APP_NAME" 2>/dev/null || true
  pm2 start ecosystem.config.cjs
  pm2 save
  echo "==> PM2 OK. Rode uma vez: pm2 startup (e o comando que o PM2 mostrar com sudo)"
else
  echo "PM2 não encontrado. Instale: sudo npm install -g pm2"
  exit 1
fi

echo "==> App em http://127.0.0.1:3012 (configure o Nginx para o teu domínio)"
pm2 list | grep -E "$APP_NAME|NAME" || true
