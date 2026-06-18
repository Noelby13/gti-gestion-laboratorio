# Gestion de laboratorios

Este proyecto es un sistema para gestionar inventario (ITAM) y reservas de laboratorios, estructurado bajo **Clean Architecture**.

## Requisitos Previos
- Node.js v18+ 
- npm

## Estructura del Proyecto
- `database/`: Scripts SQL para crear el esquema (adaptado a SQLite) e insertar datos de prueba.
- `backend/`: API REST Node.js (Express, TypeScript, better-sqlite3).
- `frontend/`: UI React (Vite, TailwindCSS) con la identidad visual institucional de la UNCSM.
- `docs/`: Documentación del proyecto.

## Inicializar el Proyecto

### 1. Backend (API y Base de Datos)
La base de datos SQLite se creará y sembrará automáticamente al iniciar el servidor por primera vez utilizando los scripts de `database/`.

```bash
cd backend
npm install
npm run dev
```
El servidor se iniciará en `http://localhost:3000`.

### 2. Frontend (Interfaz de Usuario)
En una terminal separada, inicia el entorno de desarrollo del frontend:

```bash
cd frontend
npm install
npm run dev
```
La aplicación web se ejecutará en la dirección proporcionada por Vite (usualmente `http://localhost:5173`).

## Stack Tecnológico
- **Base de Datos**: SQLite (`better-sqlite3`)
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TailwindCSS

