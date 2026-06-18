-- ============================================================================
-- 1. MÓDULO DE ACCESOS Y USUARIOS
-- ============================================================================

CREATE TABLE "Rol" (
    "idRol" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nombreRol" TEXT NOT NULL
);

CREATE TABLE "Usuario" (
    "idUsuario" INTEGER PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL UNIQUE,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "numTelefono" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "cedula" TEXT NOT NULL UNIQUE,
    "pwHash" TEXT NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "idRol" INTEGER NOT NULL,
    FOREIGN KEY ("idRol") REFERENCES "Rol" ("idRol") ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ============================================================================
-- 2. MÓDULO DE INVENTARIADO Y JERARQUÍA TI (ITAM)
-- ============================================================================

CREATE TABLE "Aula" (
    "idAula" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nombreAula" TEXT NOT NULL,
    "edificio" TEXT NOT NULL,
    "capacidadPersonas" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "EstacionTrabajo" (
    "idEstacion" INTEGER PRIMARY KEY AUTOINCREMENT,
    "idAula" INTEGER NOT NULL,
    "identificador" TEXT NOT NULL, -- Ej: 'Mesa 1', 'Rack A', 'Escritorio Docente'
    "tipo" TEXT NOT NULL,          -- Ej: 'Estudiante', 'Infraestructura', 'Docente'
    FOREIGN KEY ("idAula") REFERENCES "Aula" ("idAula") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "TipoEquipo" (
    "idTipoEquipo" INTEGER PRIMARY KEY AUTOINCREMENT,
    "nombreTipo" TEXT NOT NULL
);

CREATE TABLE "ComponenteTI" (
    "idComponente" INTEGER PRIMARY KEY AUTOINCREMENT,
    "idEstacion" INTEGER NOT NULL,
    "idTipoEquipo" INTEGER NOT NULL,
    "codigoInventario" TEXT NOT NULL UNIQUE,
    "numeroSerie" TEXT UNIQUE,
    "estadoCicloVida" TEXT NOT NULL, -- Ej: 'Bodega', 'Disponible', 'En Mantenimiento', 'Retirado'
    "fechaAdquisicion" DATE,
    "finGarantia" DATE,
    FOREIGN KEY ("idEstacion") REFERENCES "EstacionTrabajo" ("idEstacion") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("idTipoEquipo") REFERENCES "TipoEquipo" ("idTipoEquipo") ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ============================================================================
-- 3. MÓDULO DE RESERVAS Y CONTROL DE CONCURRENCIA
-- ============================================================================

CREATE TABLE "ReservaAula" (
    "idReserva" INTEGER PRIMARY KEY AUTOINCREMENT,
    "idAula" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY ("idAula") REFERENCES "Aula" ("idAula") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("idUsuario") ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE "HistorialEstadoEquipo" (
    "idHistorial" INTEGER PRIMARY KEY AUTOINCREMENT,
    "idComponente" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaCambio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" TEXT,
    FOREIGN KEY ("idComponente") REFERENCES "ComponenteTI" ("idComponente") ON UPDATE CASCADE ON DELETE CASCADE
);
