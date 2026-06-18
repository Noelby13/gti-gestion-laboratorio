import { LaboratorioRepository } from './laboratorio.repository';

export class LaboratorioService {
    private repository: LaboratorioRepository;

    constructor() {
        this.repository = new LaboratorioRepository();
    }

    async obtenerTodosLosLaboratorios(): Promise<any[]> {
        return this.repository.findAll();
    }

    async obtenerLaboratorioPorId(idAula: number): Promise<any> {
        const lab = await this.repository.findById(idAula);
        if (!lab) {
            throw new Error('Laboratorio no encontrado');
        }
        return lab;
    }
}
