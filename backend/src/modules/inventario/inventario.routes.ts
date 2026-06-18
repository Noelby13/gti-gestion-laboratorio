import { Router } from 'express';
import { InventarioController } from './inventario.controller';

const router = Router();
const controller = new InventarioController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id/estado', controller.updateEstado);
router.get('/:id/historial', controller.getHistorial);
router.get('/estadisticas/:idAula', controller.getEstadisticasAula);

export const inventarioRouter = router;
