/**
 * Servidor HTTP estático para produção (Hostinger + PM2).
 * PORT via env (PM2 ecosystem) — padrão 3012.
 */
const http = require('http');
const path = require('path');
const serveHandler = require('serve-handler');

const PORT = parseInt(process.env.PORT || '3012', 10);
const HOST = process.env.HOST || '0.0.0.0';

const BLOCKED_PREFIXES = ['/node_modules', '/.git'];
const BLOCKED_FILES = new Set([
  '/package.json',
  '/package-lock.json',
  '/server.js',
  '/ecosystem.config.cjs',
]);

function isBlocked(urlPath) {
  const p = urlPath.split('?')[0];
  if (BLOCKED_FILES.has(p)) return true;
  for (const prefix of BLOCKED_PREFIXES) {
    if (p === prefix || p.startsWith(prefix + '/')) return true;
  }
  return false;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || '/';
  if (isBlocked(urlPath)) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }
  return serveHandler(req, res, {
    public: path.join(__dirname),
    // Obrigatório para servir /index.html em GET / (com false, vira listagem de pasta)
    cleanUrls: true,
    directoryListing: false,
    etag: true,
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[cardapio] http://${HOST}:${PORT}`);
});
