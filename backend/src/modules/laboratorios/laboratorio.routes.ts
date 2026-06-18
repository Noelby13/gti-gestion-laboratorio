import { Router } from 'express';
import { LaboratorioController } from './laboratorio.controller';

const router = Router();
const controller = new LaboratorioController();

router.get('/', controller.getAllLaboratorios);
router.get('/:id', controller.getLaboratorioById);

export const laboratorioRouter = router;
