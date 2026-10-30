CREATE DATABASE IF NOT EXISTS karen_flix
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE karen_flix;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(250),
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contrasena VARCHAR(250) NOT NULL,
    `role` ENUM('usuario', 'administrador') NOT NULL DEFAULT 'usuario',
    activo TINYINT NOT NULL DEFAULT 1,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    imagen_url VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS directores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(250),
    foto_url VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS actores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(250),
    foto_url VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS peliculas (
    idpelicula INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    sinopsis TEXT NOT NULL,
    anio_estreno INT NOT NULL,
    duracion_minutos INT,
    idcategoria INT NOT NULL,
    iddirector INT,
    imagen VARCHAR(255),
    trailer_url VARCHAR(255),
    tipo ENUM('pelicula', 'serie') NOT NULL DEFAULT 'pelicula',
    estado ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    calificacion_promedio DECIMAL(4, 2) NOT NULL DEFAULT 0,
    total_resenas INT UNSIGNED NOT NULL DEFAULT 0,
    creada_por INT,
    aprobada_por INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_peliculas_categoria FOREIGN KEY (idcategoria) REFERENCES categorias(id),
    CONSTRAINT fk_peliculas_director FOREIGN KEY (iddirector) REFERENCES directores(id) ON DELETE SET NULL,
    CONSTRAINT fk_peliculas_creada_por FOREIGN KEY (creada_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_peliculas_aprobada_por FOREIGN KEY (aprobada_por) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelicula_categorias (
    idpelicula INT NOT NULL,
    idcategoria INT NOT NULL,
    PRIMARY KEY (idpelicula, idcategoria),
    FOREIGN KEY (idpelicula) REFERENCES peliculas(idpelicula) ON DELETE CASCADE,
    FOREIGN KEY (idcategoria) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelicula_directores (
    idpelicula INT NOT NULL,
    iddirector INT NOT NULL,
    PRIMARY KEY (idpelicula, iddirector),
    FOREIGN KEY (idpelicula) REFERENCES peliculas(idpelicula) ON DELETE CASCADE,
    FOREIGN KEY (iddirector) REFERENCES directores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelicula_actores (
    idpelicula INT NOT NULL,
    idactor INT NOT NULL,
    personaje VARCHAR(100),
    PRIMARY KEY (idpelicula, idactor),
    FOREIGN KEY (idpelicula) REFERENCES peliculas(idpelicula) ON DELETE CASCADE,
    FOREIGN KEY (idactor) REFERENCES actores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idpelicula INT NOT NULL,
    idusuario INT NOT NULL,
    titulo VARCHAR(150) NOT NULL DEFAULT 'Reseña',
    comentarios TEXT NOT NULL,
    fechaResena DATE NOT NULL,
    puntaje TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idpelicula) REFERENCES peliculas(idpelicula) ON DELETE CASCADE,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_resenas_puntaje CHECK (puntaje BETWEEN 1 AND 10)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resena_votos (
    idresena INT NOT NULL,
    idusuario INT NOT NULL,
    voto ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idresena, idusuario),
    FOREIGN KEY (idresena) REFERENCES resenas(id) ON DELETE CASCADE,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
