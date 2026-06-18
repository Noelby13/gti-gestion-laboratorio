import { ReservaRepository } from './reserva.repository';

export class ReservaService {
    private repository: ReservaRepository;

    constructor() {
        this.repository = new ReservaRepository();
    }

    async obtenerTodas(): Promise<any[]> {
        return this.repository.findAll();
    }

    async crearReserva(data: { idAula: number, idUsuario: number, fechaInicio: string, fechaFin: string }): Promise<any> {
        // Validar intervalos de 30 minutos
        const inicio = new Date(data.fechaInicio);
        const fin = new Date(data.fechaFin);

        if (inicio.getMinutes() % 30 !== 0 || fin.getMinutes() % 30 !== 0) {
            throw new Error('Las reservas solo pueden realizarse en intervalos de 30 minutos (ej. 08:00, 08:30).');
        }

        if (inicio >= fin) {
            throw new Error('La fecha/hora de inicio debe ser anterior a la de fin.');
        }

        // Validación de double-booking en la capa de casos de uso
        const overlapping = await this.repository.findOverlapping(data.idAula, data.fechaInicio, data.fechaFin);

        if (overlapping.length > 0) {
            throw new Error('Conflicto de reserva: El aula ya está reservada en ese horario ');
        }

        return this.repository.create(data);
    }
}
