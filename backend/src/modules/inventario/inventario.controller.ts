import { Request, Response } from 'express';
import { InventarioService } from './inventario.service';

export class InventarioController {
    private service: InventarioService;

    constructor() {
        this.service = new InventarioService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const equipos = await this.service.obtenerTodos();
            res.json(equipos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const nuevo = await this.service.registrarEquipo(req.body);
            res.status(201).json(nuevo);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    updateEstado = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const { estadoCicloVida, observacion } = req.body;
            const actualizado = await this.service.actualizarEstado(id, estadoCicloVida, observacion);
            res.json(actualizado);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getHistorial = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const historial = await this.service.obtenerHistorial(id);
            res.json(historial);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getEstadisticasAula = async (req: Request, res: Response) => {
        try {
            const idAula = parseInt(req.params.idAula);
            const estadisticas = await this.service.obtenerEstadisticasAula(idAula);
            res.json(estadisticas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
