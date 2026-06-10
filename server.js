'use strict';

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Swagger] Docs available at http://localhost:${PORT}/api-docs`);
  console.log(`[Admin] Email: admin@qty.com`);
});

server.on('error', (err) => {
  console.error(`[Server] Failed to start: ${err.message}`);
  process.exit(1);
});
