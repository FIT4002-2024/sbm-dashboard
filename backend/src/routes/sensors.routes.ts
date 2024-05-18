import { Router } from 'express';
import { getSensorIds } from '../controllers/sensors.controllers';

const router = Router();

router.get('/', getSensorIds);

export default router;