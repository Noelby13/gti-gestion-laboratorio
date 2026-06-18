-- Inserción de Roles Base
INSERT INTO "Rol" ("nombreRol") VALUES ('Administrador');
INSERT INTO "Rol" ("nombreRol") VALUES ('Docente');
INSERT INTO "Rol" ("nombreRol") VALUES ('Estudiante');

-- Inserción de Usuario de Prueba (Contraseña: 'admin123' - hash simulado para demostración)
INSERT INTO "Usuario" ("username", "nombres", "apellidos", "numTelefono", "email", "cedula", "pwHash", "estado", "idRol") 
VALUES ('admin', 'Juan', 'Pérez', '88888888', 'admin@uncsm.edu.ni', '001-000000-0000A', '$2b$10$xyzsimulatedhash123', 1, 1);

-- Inserción de Aulas
INSERT INTO "Aula" ("nombreAula", "edificio", "capacidadPersonas", "estado") 
VALUES ('Laboratorio Computación 1', 'Edificio Central', 30, 1);
INSERT INTO "Aula" ("nombreAula", "edificio", "capacidadPersonas", "estado") 
VALUES ('Laboratorio Computación 2', 'Edificio Central', 25, 1);

-- Inserción de Estaciones de Trabajo
INSERT INTO "EstacionTrabajo" ("idAula", "identificador", "tipo") 
VALUES (1, 'Escritorio Docente', 'Docente');
INSERT INTO "EstacionTrabajo" ("idAula", "identificador", "tipo") 
VALUES (1, 'Mesa 1', 'Estudiante');

-- Inserción de Tipos de Equipo
INSERT INTO "TipoEquipo" ("nombreTipo") VALUES ('Computadora de Escritorio');
INSERT INTO "TipoEquipo" ("nombreTipo") VALUES ('Proyector');
INSERT INTO "TipoEquipo" ("nombreTipo") VALUES ('Switch de Red');

-- Inserción de Componentes TI
INSERT INTO "ComponenteTI" ("idEstacion", "idTipoEquipo", "codigoInventario", "numeroSerie", "estadoCicloVida", "fechaAdquisicion", "finGarantia") 
VALUES (1, 1, 'INV-COMP-001', 'SN-987654321', 'Desplegado', '2023-01-15', '2026-01-15');
INSERT INTO "ComponenteTI" ("idEstacion", "idTipoEquipo", "codigoInventario", "numeroSerie", "estadoCicloVida", "fechaAdquisicion", "finGarantia") 
VALUES (2, 1, 'INV-COMP-002', 'SN-123456789', 'Desplegado', '2023-01-15', '2026-01-15');

-- Inserción de una Reserva de Prueba
INSERT INTO "ReservaAula" ("idAula", "idUsuario", "fechaInicio", "fechaFin", "estado") 
VALUES (1, 1, '2026-06-20 08:00:00', '2026-06-20 10:00:00', 1);
