import { db } from '../../infrastructure/database/sqlite';

export class LaboratorioRepository {
    async findAll(): Promise<any[]> {
        const stmt = db.prepare('SELECT * FROM Aula');
        return stmt.all();
    }

    async findById(idAula: number): Promise<any> {
        const stmt = db.prepare('SELECT * FROM Aula WHERE idAula = ?');
        return stmt.get(idAula);
    }
}
