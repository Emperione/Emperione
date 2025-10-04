import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { loadConfig } from './config/config';

const config = loadConfig();

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', env: config.nodeEnv }));

const port = config.port || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${port}`);
});
