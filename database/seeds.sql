-- ==========================================
-- SEED SCRIPT: Aulas, Laboratorios y Equipos
-- ==========================================

-- 0. Insertar Roles y Usuario por defecto
INSERT INTO "Rol" ("nombreRol") VALUES 
('Administrador'), 
('Docente'), 
('Estudiante');

INSERT INTO "Usuario" ("username", "nombres", "apellidos", "email", "cedula", "pwHash", "idRol") VALUES 
('admin', 'Usuario', 'Administrador', 'admin@lab.com', '0000000000', '123456', 1);


-- 1. Insertar Tipos de Equipo
INSERT INTO "TipoEquipo" ("nombreTipo") VALUES 
('Computadora'), -- ID 1
('Proyector'),   -- ID 2
('Teclado'),     -- ID 3
('Ratón');       -- ID 4

-- 2. Insertar Laboratorios (P1 a P5)
INSERT INTO "Aula" ("nombreAula", "edificio", "capacidadPersonas", "estado") VALUES 
('Laboratorio P1', 'P', 20, 1), -- ID 1
('Laboratorio P2', 'P', 20, 1), -- ID 2
('Laboratorio P3', 'P', 20, 1), -- ID 3
('Laboratorio P4', 'P', 20, 1), -- ID 4
('Laboratorio P5', 'P', 20, 1); -- ID 5

-- 3. Insertar Aulas (L1 a L5)
INSERT INTO "Aula" ("nombreAula", "edificio", "capacidadPersonas", "estado") VALUES 
('Aula L1', 'L', 12, 1), -- ID 6
('Aula L2', 'L', 12, 1), -- ID 7
('Aula L3', 'L', 12, 1), -- ID 8
('Aula L4', 'L', 12, 1), -- ID 9
('Aula L5', 'L', 12, 1); -- ID 10

-- 4. Insertar Estaciones de Trabajo
-- Para Laboratorios P1-P5 (Mesa Docente y Mesa Estudiantil)
INSERT INTO "EstacionTrabajo" ("idAula", "identificador", "tipo") VALUES 
(1, 'Mesa Docente', 'Docente'),       -- ID 1
(1, 'Mesa Estudiantil', 'Estudiante'),-- ID 2
(2, 'Mesa Docente', 'Docente'),       -- ID 3
(2, 'Mesa Estudiantil', 'Estudiante'),-- ID 4
(3, 'Mesa Docente', 'Docente'),       -- ID 5
(3, 'Mesa Estudiantil', 'Estudiante'),-- ID 6
(4, 'Mesa Docente', 'Docente'),       -- ID 7
(4, 'Mesa Estudiantil', 'Estudiante'),-- ID 8
(5, 'Mesa Docente', 'Docente'),       -- ID 9
(5, 'Mesa Estudiantil', 'Estudiante');-- ID 10

-- Para Aulas L1-L5 (Solo Mesa Docente)
INSERT INTO "EstacionTrabajo" ("idAula", "identificador", "tipo") VALUES 
(6, 'Mesa Docente', 'Docente'),       -- ID 11
(7, 'Mesa Docente', 'Docente'),       -- ID 12
(8, 'Mesa Docente', 'Docente'),       -- ID 13
(9, 'Mesa Docente', 'Docente'),       -- ID 14
(10, 'Mesa Docente', 'Docente');      -- ID 15

-- 5. Insertar Componentes TI
-- =======================================================
-- Equipamiento para Mesas Docentes (IDs 1, 3, 5, 7, 9, 11, 12, 13, 14, 15)
-- 1 Computadora (ID 1), 1 Proyector (ID 2)
-- =======================================================
INSERT INTO "ComponenteTI" ("idEstacion", "idTipoEquipo", "codigoInventario", "estadoCicloVida") VALUES 
-- Lab P1 Docente
(1, 1, 'COMP-DOC-P1', 'Disponible'),
(1, 2, 'PROY-DOC-P1', 'Disponible'),
-- Lab P2 Docente
(3, 1, 'COMP-DOC-P2', 'Disponible'),
(3, 2, 'PROY-DOC-P2', 'Disponible'),
-- Lab P3 Docente
(5, 1, 'COMP-DOC-P3', 'Disponible'),
(5, 2, 'PROY-DOC-P3', 'Disponible'),
-- Lab P4 Docente
(7, 1, 'COMP-DOC-P4', 'Disponible'),
(7, 2, 'PROY-DOC-P4', 'Disponible'),
-- Lab P5 Docente
(9, 1, 'COMP-DOC-P5', 'Disponible'),
(9, 2, 'PROY-DOC-P5', 'Disponible'),

-- Aula L1 Docente
(11, 1, 'COMP-DOC-L1', 'Disponible'),
(11, 2, 'PROY-DOC-L1', 'Disponible'),
-- Aula L2 Docente
(12, 1, 'COMP-DOC-L2', 'Disponible'),
(12, 2, 'PROY-DOC-L2', 'Disponible'),
-- Aula L3 Docente
(13, 1, 'COMP-DOC-L3', 'Disponible'),
(13, 2, 'PROY-DOC-L3', 'Disponible'),
-- Aula L4 Docente
(14, 1, 'COMP-DOC-L4', 'Disponible'),
(14, 2, 'PROY-DOC-L4', 'Disponible'),
-- Aula L5 Docente
(15, 1, 'COMP-DOC-L5', 'Disponible'),
(15, 2, 'PROY-DOC-L5', 'Disponible');

-- =======================================================
-- Equipamiento para Mesas Estudiantiles (Solo Labs: IDs 2, 4, 6, 8, 10)
-- 3 Computadoras (ID 1), 3 Teclados (ID 3), 3 Ratones (ID 4)
-- =======================================================
INSERT INTO "ComponenteTI" ("idEstacion", "idTipoEquipo", "codigoInventario", "estadoCicloVida") VALUES 
-- Lab P1 Estudiantil
(2, 1, 'COMP-EST-P1-01', 'Disponible'), (2, 3, 'TECL-EST-P1-01', 'Disponible'), (2, 4, 'RAT-EST-P1-01', 'Disponible'),
(2, 1, 'COMP-EST-P1-02', 'Disponible'), (2, 3, 'TECL-EST-P1-02', 'Disponible'), (2, 4, 'RAT-EST-P1-02', 'Disponible'),
(2, 1, 'COMP-EST-P1-03', 'Disponible'), (2, 3, 'TECL-EST-P1-03', 'Disponible'), (2, 4, 'RAT-EST-P1-03', 'Disponible'),

-- Lab P2 Estudiantil
(4, 1, 'COMP-EST-P2-01', 'Disponible'), (4, 3, 'TECL-EST-P2-01', 'Disponible'), (4, 4, 'RAT-EST-P2-01', 'Disponible'),
(4, 1, 'COMP-EST-P2-02', 'Disponible'), (4, 3, 'TECL-EST-P2-02', 'Disponible'), (4, 4, 'RAT-EST-P2-02', 'Disponible'),
(4, 1, 'COMP-EST-P2-03', 'Disponible'), (4, 3, 'TECL-EST-P2-03', 'Disponible'), (4, 4, 'RAT-EST-P2-03', 'Disponible'),

-- Lab P3 Estudiantil
(6, 1, 'COMP-EST-P3-01', 'Disponible'), (6, 3, 'TECL-EST-P3-01', 'Disponible'), (6, 4, 'RAT-EST-P3-01', 'Disponible'),
(6, 1, 'COMP-EST-P3-02', 'Disponible'), (6, 3, 'TECL-EST-P3-02', 'Disponible'), (6, 4, 'RAT-EST-P3-02', 'Disponible'),
(6, 1, 'COMP-EST-P3-03', 'Disponible'), (6, 3, 'TECL-EST-P3-03', 'Disponible'), (6, 4, 'RAT-EST-P3-03', 'Disponible'),

-- Lab P4 Estudiantil
(8, 1, 'COMP-EST-P4-01', 'Disponible'), (8, 3, 'TECL-EST-P4-01', 'Disponible'), (8, 4, 'RAT-EST-P4-01', 'Disponible'),
(8, 1, 'COMP-EST-P4-02', 'Disponible'), (8, 3, 'TECL-EST-P4-02', 'Disponible'), (8, 4, 'RAT-EST-P4-02', 'Disponible'),
(8, 1, 'COMP-EST-P4-03', 'Disponible'), (8, 3, 'TECL-EST-P4-03', 'Disponible'), (8, 4, 'RAT-EST-P4-03', 'Disponible'),

-- Lab P5 Estudiantil
(10, 1, 'COMP-EST-P5-01', 'Disponible'), (10, 3, 'TECL-EST-P5-01', 'Disponible'), (10, 4, 'RAT-EST-P5-01', 'Disponible'),
(10, 1, 'COMP-EST-P5-02', 'Disponible'), (10, 3, 'TECL-EST-P5-02', 'Disponible'), (10, 4, 'RAT-EST-P5-02', 'Disponible'),
(10, 1, 'COMP-EST-P5-03', 'Disponible'), (10, 3, 'TECL-EST-P5-03', 'Disponible'), (10, 4, 'RAT-EST-P5-03', 'Disponible');
