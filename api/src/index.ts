import compression from 'compression';
import cors from 'cors';
import express from 'express';

import { loadConfig } from './config/config';
import authRoutes from './routes/auth.routes';
import serversRoutes from './routes/servers.routes';

const config = loadConfig();

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', env: config.nodeEnv })
);

// API routes
app.use('/api/servers', serversRoutes);
app.use('/api/auth', authRoutes);

const port = config.port || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
});
