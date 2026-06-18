import { db } from '../../infrastructure/database/sqlite';

export class ReservaRepository {
    async findAll(): Promise<any[]> {
        const stmt = db.prepare(`
            SELECT r.idReserva, r.fechaInicio, r.fechaFin, r.estado,
                   a.nombreAula, a.edificio, u.nombres || ' ' || u.apellidos as usuario
            FROM ReservaAula r
            JOIN Aula a ON r.idAula = a.idAula
            JOIN Usuario u ON r.idUsuario = u.idUsuario
            ORDER BY r.fechaInicio ASC
        `);
        return stmt.all();
    }

    async findOverlapping(idAula: number, fechaInicio: string, fechaFin: string): Promise<any[]> {
        const stmt = db.prepare(`
            SELECT * FROM ReservaAula 
            WHERE idAula = ? AND estado = 1
            AND (
                (fechaInicio < ? AND fechaFin > ?) OR
                (fechaInicio >= ? AND fechaInicio < ?)
            )
        `);
        return stmt.all(idAula, fechaFin, fechaInicio, fechaInicio, fechaFin);
    }

    async create(reserva: { idAula: number, idUsuario: number, fechaInicio: string, fechaFin: string }): Promise<any> {
        const stmt = db.prepare(`
            INSERT INTO ReservaAula (idAula, idUsuario, fechaInicio, fechaFin, estado)
            VALUES (?, ?, ?, ?, 1)
        `);
        const info = stmt.run(reserva.idAula, reserva.idUsuario, reserva.fechaInicio, reserva.fechaFin);
        return { idReserva: info.lastInsertRowid, ...reserva };
    }
}
