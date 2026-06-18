import { Router } from 'express';
import { CatalogoController } from './catalogo.controller';

const router = Router();
const controller = new CatalogoController();

router.get('/aulas', controller.getAulas);
router.post('/aulas', controller.createAula);

router.get('/estaciones', controller.getEstaciones);
router.post('/estaciones', controller.createEstacion);

router.get('/tipos-equipo', controller.getTiposEquipo);
router.post('/tipos-equipo', controller.createTipoEquipo);

export const catalogoRouter = router;
