import { Request, Response } from 'express';
import { CatalogoService } from './catalogo.service';

export class CatalogoController {
    private service: CatalogoService;

    constructor() {
        this.service = new CatalogoService();
    }

    getAulas = async (req: Request, res: Response) => {
        try {
            res.json(await this.service.getAulas());
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createAula = async (req: Request, res: Response) => {
        try {
            const nuevaAula = await this.service.createAula(req.body);
            res.status(201).json(nuevaAula);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getEstaciones = async (req: Request, res: Response) => {
        try {
            res.json(await this.service.getEstaciones());
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createEstacion = async (req: Request, res: Response) => {
        try {
            const nuevaEstacion = await this.service.createEstacion(req.body);
            res.status(201).json(nuevaEstacion);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getTiposEquipo = async (req: Request, res: Response) => {
        try {
            res.json(await this.service.getTiposEquipo());
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createTipoEquipo = async (req: Request, res: Response) => {
        try {
            const nuevoTipo = await this.service.createTipoEquipo(req.body);
            res.status(201).json(nuevoTipo);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
