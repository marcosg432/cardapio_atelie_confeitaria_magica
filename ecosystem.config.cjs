/**
 * PM2 — produção Hostinger
 * Uso: pm2 start ecosystem.config.cjs
 *      pm2 save && pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'cardapio-atelie-confeitaria-magica',
      script: './server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: 3012,
        HOST: '0.0.0.0',
      },
    },
  ],
};
