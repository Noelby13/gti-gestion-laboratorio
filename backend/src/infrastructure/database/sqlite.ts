import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ruta absoluta a la base de datos (se guarda en la carpeta principal de la app o backend)
const dbPath = path.resolve(__dirname, '../../../../database/app.db');

export const db = new Database(dbPath, { verbose: console.log });

// Inicialización de la base de datos con los scripts si está vacía
const initDB = () => {
    try {
        const checkTables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='Usuario';`).get();
        if (!checkTables) {
            console.log('Inicializando Base de Datos...');
            const schemaPath = path.resolve(__dirname, '../../../../database/schema.sql');
            const seedsPath = path.resolve(__dirname, '../../../../database/seeds.sql');
            
            const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
            const seedsSql = fs.readFileSync(seedsPath, 'utf-8');
            
            db.exec(schemaSql);
            console.log('Esquema creado correctamente.');
            
            db.exec(seedsSql);
            console.log('Semillas insertadas correctamente.');
        } else {
            console.log('La Base de Datos ya está inicializada.');
        }
    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
    }
};

initDB();

export default db;
