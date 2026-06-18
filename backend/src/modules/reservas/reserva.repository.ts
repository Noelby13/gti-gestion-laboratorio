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

    async update(idReserva: number, data: { idAula?: number, fechaInicio?: string, fechaFin?: string }): Promise<any> {
        const fields = [];
        const values = [];
        if (data.idAula !== undefined) {
            fields.push('idAula = ?');
            values.push(data.idAula);
        }
        if (data.fechaInicio !== undefined) {
            fields.push('fechaInicio = ?');
            values.push(data.fechaInicio);
        }
        if (data.fechaFin !== undefined) {
            fields.push('fechaFin = ?');
            values.push(data.fechaFin);
        }
        
        if (fields.length === 0) return null;

        values.push(idReserva);
        const query = `UPDATE ReservaAula SET ${fields.join(', ')} WHERE idReserva = ?`;
        const stmt = db.prepare(query);
        stmt.run(...values);
        
        const fetchStmt = db.prepare(`SELECT * FROM ReservaAula WHERE idReserva = ?`);
        return fetchStmt.get(idReserva);
    }
}
