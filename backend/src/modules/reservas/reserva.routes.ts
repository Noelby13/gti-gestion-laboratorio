import { Router } from 'express';
import { ReservaController } from './reserva.controller';

const router = Router();
const controller = new ReservaController();

router.get('/', controller.getAll);
router.post('/', controller.create);

export const reservaRouter = router;
