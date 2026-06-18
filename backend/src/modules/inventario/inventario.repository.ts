import { db } from '../../infrastructure/database/sqlite';

export class InventarioRepository {
    async findAll(): Promise<any[]> {
        const stmt = db.prepare(`
            SELECT c.idComponente, c.codigoInventario, c.numeroSerie, c.estadoCicloVida, c.fechaAdquisicion, 
                   t.nombreTipo, e.identificador as estacion, a.nombreAula as aula
            FROM ComponenteTI c
            JOIN TipoEquipo t ON c.idTipoEquipo = t.idTipoEquipo
            JOIN EstacionTrabajo e ON c.idEstacion = e.idEstacion
            JOIN Aula a ON e.idAula = a.idAula
        `);
        return stmt.all();
    }

    async create(data: { idEstacion: number, idTipoEquipo: number, codigoInventario: string, numeroSerie?: string, estadoCicloVida: string, fechaAdquisicion?: string }): Promise<any> {
        try {
            const result = db.transaction(() => {
                const stmt = db.prepare(`
                    INSERT INTO ComponenteTI (idEstacion, idTipoEquipo, codigoInventario, numeroSerie, estadoCicloVida, fechaAdquisicion)
                    VALUES (?, ?, ?, ?, ?, ?)
                `);
                const info = stmt.run(data.idEstacion, data.idTipoEquipo, data.codigoInventario, data.numeroSerie || null, data.estadoCicloVida, data.fechaAdquisicion || null);
                const idComponente = info.lastInsertRowid;
                
                const histStmt = db.prepare(`
                    INSERT INTO HistorialEstadoEquipo (idComponente, estado, observacion)
                    VALUES (?, ?, ?)
                `);
                histStmt.run(idComponente, data.estadoCicloVida, 'Registro inicial');
                
                return { idComponente, ...data };
            })();
            return result;
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' && error.message.includes('codigoInventario')) {
                throw new Error('El código de inventario ya está registrado.');
            }
            throw error;
        }
    }

    async updateEstado(idComponente: number, estadoCicloVida: string, observacion: string = ''): Promise<any> {
        const result = db.transaction(() => {
            const stmt = db.prepare(`
                UPDATE ComponenteTI
                SET estadoCicloVida = ?
                WHERE idComponente = ?
            `);
            stmt.run(estadoCicloVida, idComponente);
            
            const histStmt = db.prepare(`
                INSERT INTO HistorialEstadoEquipo (idComponente, estado, observacion)
                VALUES (?, ?, ?)
            `);
            histStmt.run(idComponente, estadoCicloVida, observacion);
            
            return { idComponente, estadoCicloVida };
        })();
        return result;
    }

    async getHistorial(idComponente: number): Promise<any[]> {
        const stmt = db.prepare(`
            SELECT idHistorial, idComponente, estado, fechaCambio, observacion
            FROM HistorialEstadoEquipo
            WHERE idComponente = ?
            ORDER BY fechaCambio DESC
        `);
        return stmt.all(idComponente);
    }

    async getEstadisticasByAula(idAula: number): Promise<any[]> {
        const stmt = db.prepare(`
            SELECT c.estadoCicloVida as estado, count(c.idComponente) as cantidad
            FROM ComponenteTI c
            JOIN EstacionTrabajo e ON c.idEstacion = e.idEstacion
            WHERE e.idAula = ?
            GROUP BY c.estadoCicloVida
        `);
        return stmt.all(idAula);
    }
}
