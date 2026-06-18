import { db } from '../../infrastructure/database/sqlite';

export class CatalogoRepository {
    async findAllAulas(): Promise<any[]> {
        return db.prepare('SELECT * FROM Aula').all();
    }

    async createAula(data: { nombreAula: string, edificio: string, capacidadPersonas: number }): Promise<any> {
        const stmt = db.prepare(`
            INSERT INTO Aula (nombreAula, edificio, capacidadPersonas)
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(data.nombreAula, data.edificio, data.capacidadPersonas);
        return { idAula: info.lastInsertRowid, ...data, estado: 1 };
    }

    async findAllEstaciones(): Promise<any[]> {
        return db.prepare(`
            SELECT e.*, a.nombreAula, a.edificio 
            FROM EstacionTrabajo e
            JOIN Aula a ON e.idAula = a.idAula
        `).all();
    }

    async findEstacionByIdentificadorAndAula(identificador: string, idAula: number): Promise<any> {
        return db.prepare(`
            SELECT * FROM EstacionTrabajo 
            WHERE identificador = ? AND idAula = ?
        `).get(identificador, idAula);
    }

    async createEstacion(data: { idAula: number, identificador: string, tipo: string }): Promise<any> {
        const stmt = db.prepare(`
            INSERT INTO EstacionTrabajo (idAula, identificador, tipo)
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(data.idAula, data.identificador, data.tipo);
        return { idEstacion: info.lastInsertRowid, ...data };
    }

    async findAllTiposEquipo(): Promise<any[]> {
        return db.prepare('SELECT * FROM TipoEquipo').all();
    }

    async createTipoEquipo(data: { nombreTipo: string }): Promise<any> {
        const stmt = db.prepare(`
            INSERT INTO TipoEquipo (nombreTipo)
            VALUES (?)
        `);
        const info = stmt.run(data.nombreTipo);
        return { idTipoEquipo: info.lastInsertRowid, ...data };
    }
}
