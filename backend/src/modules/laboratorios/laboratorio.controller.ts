import { Request, Response } from 'express';
import { LaboratorioService } from './laboratorio.service';

export class LaboratorioController {
    private service: LaboratorioService;

    constructor() {
        this.service = new LaboratorioService();
    }

    getAllLaboratorios = async (req: Request, res: Response) => {
        try {
            const laboratorios = await this.service.obtenerTodosLosLaboratorios();
            res.json(laboratorios);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getLaboratorioById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const laboratorio = await this.service.obtenerLaboratorioPorId(id);
            res.json(laboratorio);
        } catch (error: any) {
            if (error.message === 'Laboratorio no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    };
}
