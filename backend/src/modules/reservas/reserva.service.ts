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

    async actualizarReserva(idReserva: number, data: { idAula?: number, fechaInicio?: string, fechaFin?: string }): Promise<any> {
        // Obtenemos la reserva actual (simplificado: confiamos en los campos enviados o validamos parcialmente)
        // En una app real, traeríamos la reserva original de la BD para tener la fecha/hora completa si no se enviaron
        // Para el caso del drag & drop en el mismo horario, usualmente solo cambiaremos idAula
        if (data.fechaInicio && data.fechaFin && data.idAula) {
            const inicio = new Date(data.fechaInicio);
            const fin = new Date(data.fechaFin);
            
            if (inicio.getMinutes() % 30 !== 0 || fin.getMinutes() % 30 !== 0) {
                throw new Error('Las reservas solo pueden realizarse en intervalos de 30 minutos.');
            }
            if (inicio >= fin) {
                throw new Error('La fecha/hora de inicio debe ser anterior a la de fin.');
            }
            
            const overlapping = await this.repository.findOverlapping(data.idAula, data.fechaInicio, data.fechaFin);
            // Filtrar overlapping para excluir la misma reserva que estamos editando
            const trueOverlapping = overlapping.filter((r: any) => r.idReserva !== idReserva);
            if (trueOverlapping.length > 0) {
                throw new Error('Conflicto de reserva: El aula ya está reservada en ese horario ');
            }
        }
        
        return this.repository.update(idReserva, data);
    }
}
