import { CatalogoRepository } from './catalogo.repository';

export class CatalogoService {
    private repository: CatalogoRepository;

    constructor() {
        this.repository = new CatalogoRepository();
    }

    async getAulas(): Promise<any[]> {
        return this.repository.findAllAulas();
    }

    async createAula(data: any): Promise<any> {
        if (!data.nombreAula || !data.edificio || data.capacidadPersonas === undefined) {
            throw new Error('Faltan datos obligatorios para crear el aula.');
        }
        return this.repository.createAula({
            nombreAula: data.nombreAula,
            edificio: data.edificio,
            capacidadPersonas: Number(data.capacidadPersonas)
        });
    }

    async getEstaciones(): Promise<any[]> {
        return this.repository.findAllEstaciones();
    }

    async createEstacion(data: any): Promise<any> {
        if (!data.idAula || !data.identificador || !data.tipo) {
            throw new Error('Faltan datos obligatorios para crear la estación (idAula, identificador, tipo).');
        }

        // Validación de identificador único por aula
        const existe = await this.repository.findEstacionByIdentificadorAndAula(data.identificador, Number(data.idAula));
        if (existe) {
            throw new Error(`La estación con el identificador "${data.identificador}" ya existe en este aula.`);
        }

        return this.repository.createEstacion({
            idAula: Number(data.idAula),
            identificador: data.identificador,
            tipo: data.tipo
        });
    }

    async getTiposEquipo(): Promise<any[]> {
        return this.repository.findAllTiposEquipo();
    }

    async createTipoEquipo(data: any): Promise<any> {
        if (!data.nombreTipo) {
            throw new Error('El nombre del tipo de equipo es obligatorio.');
        }
        return this.repository.createTipoEquipo({
            nombreTipo: data.nombreTipo
        });
    }
}
