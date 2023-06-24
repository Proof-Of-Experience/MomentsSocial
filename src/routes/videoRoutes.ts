import { Router } from 'express';
import { getVideoInfo } from '../controllers/videoController';

const router: Router = Router();

router.get('/video-info', getVideoInfo);

export default router;
