import { Router } from 'express';

import { serversController } from '../controllers/serversController';
import { requireAuth } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validator';
import { createServerSchema, updateServerSchema } from '../validators/servers';
import { z } from 'zod';

const idParamSchema = z.object({ id: z.string().min(1) });

const router = Router();

// Public
router.get('/', serversController.list);

// Protected
router.post('/', requireAuth, validateBody(createServerSchema), serversController.create);
router.put('/:id', requireAuth, validateParams(idParamSchema), validateBody(updateServerSchema), serversController.update);
router.delete('/:id', requireAuth, validateParams(idParamSchema), serversController.remove);

export default router;
