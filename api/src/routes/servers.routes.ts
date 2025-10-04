import { Router } from 'express';
import { serversController } from '../controllers/serversController';

const router = Router();

router.get('/', serversController.list);

export default router;
