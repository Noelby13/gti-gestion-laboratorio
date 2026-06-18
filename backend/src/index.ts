import express from 'express';
import cors from 'cors';
import { laboratorioRouter } from './modules/laboratorios/laboratorio.routes';
import { inventarioRouter } from './modules/inventario/inventario.routes';
import { reservaRouter } from './modules/reservas/reserva.routes';
import { catalogoRouter } from './modules/catalogo/catalogo.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import database to initialize
import './infrastructure/database/sqlite';

// Rutas
app.use('/api/laboratorios', laboratorioRouter);
app.use('/api/inventario', inventarioRouter);
app.use('/api/reservas', reservaRouter);
app.use('/api/catalogo', catalogoRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
