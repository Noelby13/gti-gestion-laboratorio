# Arquitectura del Sistema de Gestión de Inventariado y Reservas

Este proyecto está construido siguiendo los principios de **Clean Architecture**, dividiendo las responsabilidades en capas claramente separadas para garantizar la mantenibilidad, escalabilidad e independencia de frameworks.

## Estructura de Directorios (Backend)

```
backend/
├── src/
│   ├── infrastructure/   # Capa de infraestructura (Base de datos, servicios externos)
│   │   └── database/     # Configuración de SQLite (better-sqlite3)
│   ├── modules/          # Funcionalidades agrupadas por dominio
│   │   ├── laboratorios/ # Módulo de ejemplo completo
│   │   │   ├── laboratorio.routes.ts      # (Capa de Presentación / Web)
│   │   │   ├── laboratorio.controller.ts  # (Capa de Controladores)
│   │   │   ├── laboratorio.service.ts     # (Capa de Casos de Uso / Lógica de Negocio)
│   │   │   └── laboratorio.repository.ts  # (Capa de Acceso a Datos / Repositorios)
```

## Capas

### 1. Rutas (Routes)
Se encargan de definir los endpoints HTTP y delegar las peticiones a los controladores correspondientes.

### 2. Controladores (Controllers)
Reciben las peticiones HTTP (Request), extraen los parámetros y el cuerpo, y llaman a los servicios (Casos de Uso) apropiados. Se encargan de dar la respuesta HTTP (Response) adecuada.

### 3. Servicios / Casos de Uso (Services)
Contienen la lógica de negocio pura. No saben nada de HTTP (Express) ni de la base de datos específica. Coordinan las operaciones llamando a los repositorios. Aquí es donde se implementaría la lógica para prevenir el "double-booking".

### 4. Repositorios (Repositories)
Implementan el acceso a los datos. Son la única parte del módulo que interactúa directamente con la base de datos SQLite (usando `better-sqlite3`). Permiten que el servicio obtenga y guarde datos sin preocuparse de cómo se almacena.

## Frontend

El frontend está construido con **React** (Vite) y **TailwindCSS**, implementando la identidad visual institucional de la UNCSM. Los colores corporativos y la tipografía base están definidos en la configuración de Tailwind (`tailwind.config.js`), permitiendo su uso global a lo largo de los componentes.
