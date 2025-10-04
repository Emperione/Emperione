import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { loadConfig } from './config/config';
import serversRoutes from './routes/servers.routes';
import authRoutes from './routes/auth.routes';

const config = loadConfig();

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', env: config.nodeEnv }));

// API routes
app.use('/api/servers', serversRoutes);
app.use('/api/auth', authRoutes);

const port = config.port || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
});
