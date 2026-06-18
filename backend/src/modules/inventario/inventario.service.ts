import { InventarioRepository } from './inventario.repository';

export class InventarioService {
    private repository: InventarioRepository;

    constructor() {
        this.repository = new InventarioRepository();
    }

    async obtenerTodos(): Promise<any[]> {
        return this.repository.findAll();
    }

    async registrarEquipo(data: any): Promise<any> {
        if (!data.codigoInventario || !data.idEstacion || !data.idTipoEquipo || !data.estadoCicloVida) {
            throw new Error('Faltan datos obligatorios para el registro del equipo.');
        }
        return this.repository.create(data);
    }

    async actualizarEstado(idComponente: number, estado: string, observacion: string = ''): Promise<any> {
        if (!estado) {
            throw new Error('El estado es obligatorio.');
        }
        return this.repository.updateEstado(idComponente, estado, observacion);
    }

    async obtenerHistorial(idComponente: number): Promise<any[]> {
        return this.repository.getHistorial(idComponente);
    }

    async obtenerEstadisticasAula(idAula: number): Promise<any[]> {
        return this.repository.getEstadisticasByAula(idAula);
    }
}
