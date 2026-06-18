import { Request, Response } from 'express';
import { ReservaService } from './reserva.service';

export class ReservaController {
    private service: ReservaService;

    constructor() {
        this.service = new ReservaService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const reservas = await this.service.obtenerTodas();
            res.json(reservas);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            // Se asume usuario 1 para pruebas si no viene en el body
            const payload = {
               ...req.body,
               idUsuario: req.body.idUsuario || 1
            }
            const nueva = await this.service.crearReserva(payload);
            res.status(201).json(nueva);
        } catch (error: any) {
            res.status(409).json({ error: error.message }); // 409 Conflict para double-booking
        }
    };
}
