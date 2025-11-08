CREATE SCHEMA IF NOT EXISTS tpprogramacion DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE tpprogramacion;

-- Tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  contrasena VARCHAR(100) NOT NULL,
  rol VARCHAR(45) NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (id),
  UNIQUE INDEX Email_UNIQUE (email ASC) VISIBLE
) ENGINE = InnoDB;

-- Tabla paciente
CREATE TABLE IF NOT EXISTS paciente (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  dni VARCHAR(45) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  obra_social VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX DNI_paciente_UNIQUE (dni ASC) VISIBLE
) ENGINE = InnoDB;

-- Tabla medico
CREATE TABLE IF NOT EXISTS medico (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  especialidad VARCHAR(45) NOT NULL,
  matricula_profesional VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX Matricula_profesional_UNIQUE (matricula_profesional ASC) VISIBLE
) ENGINE = InnoDB;

-- Tabla turno
CREATE TABLE IF NOT EXISTS turno (
  id INT NOT NULL AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  medico_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado VARCHAR(45) NOT NULL,
  observaciones TEXT NULL,
  PRIMARY KEY (id),
  INDEX fk_id_paciente_idx (paciente_id ASC) VISIBLE,
  INDEX fk_id_medico_idx (medico_id ASC) VISIBLE,
  CONSTRAINT fk_id_medico
    FOREIGN KEY (medico_id)
    REFERENCES medico (id),
  CONSTRAINT fk_id_paciente
    FOREIGN KEY (paciente_id)
    REFERENCES paciente (id)
) ENGINE = InnoDB;