import compression from 'compression';
import cors from 'cors';
import express from 'express';
import * as Sentry from '@sentry/node';

import { loadConfig } from './config/config';
import apiRoutes from './routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const config = loadConfig();

const app = express();

// Optional Sentry initialization
if (process.env['SENTRY_DSN']) {
  Sentry.init({ dsn: process.env['SENTRY_DSN'], environment: config.nodeEnv });
  // Handlers typing can be absent depending on the @sentry/node version; cast to any to keep runtime behavior
  app.use((Sentry as any).Handlers.requestHandler());
}

app.use(cors());
app.use(compression());
app.use(express.json());

// Request logging (assigns request id and logs duration)
app.use(requestLogger);

app.get('/health', (_req, res) => res.json({ status: 'ok', env: config.nodeEnv }));

// API routes (aggregated)
app.use('/api', apiRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Sentry error handler (if initialized)
if (process.env['SENTRY_DSN']) {
  // Handlers may not be typed in some versions; cast to any to avoid TS errors while preserving runtime behavior
  app.use((Sentry as any).Handlers.errorHandler());
}

// Global error handler
app.use(errorHandler);

const port = config.port || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
});
