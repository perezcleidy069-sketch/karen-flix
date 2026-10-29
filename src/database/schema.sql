
CREATE DATABASE IF NOT EXISTS kare_flix;
USE karen_flix;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(250),
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contrasena VARCHAR(250) NOT NULL,
    role ENUM('usuario', 'administrador') NOT NULL,
    activo TINYINT CHECK(activo = 0 OR activo = 1) DEFAULT 1,
likes INT DEFAULT 0,
    dislikes INT DEFAULT 0
) ENGINE=InnoDB;

-- 2. Tabla de Categorías / Géneros
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

-- 4. Tabla de Directores (Normalizado para evitar redundancia)
CREATE TABLE IF NOT EXISTS directores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(250)
) ENGINE=InnoDB;


-- 2. Crear después la tabla dependiente (Hija) con las referencias correctas
CREATE TABLE IF NOT EXISTS pelicula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    sinopsis TEXT,
    anio_estreno INT,
    duracion_minutos INT,
    idcategoria INT NOT NULL,  
    idDirector INT NOT NULL,
    imagen VARCHAR(255),
    trailer_url VARCHAR(255),
    FOREIGN KEY (idcategoria) REFERENCES categorias(id),
    FOREIGN KEY (idDirector) REFERENCES directores(id) -- Corregido de 'dictores' a 'directores'
) ENGINE=InnoDB;

-- 6. Tabla Intermedia: Películas y Categorías (Muchos a Muchos: una peli puede tener varios géneros)
CREATE TABLE IF NOT EXISTS pelicula_categorias (
    idpelicula INT NOT NULL,
    idcategoria INT NOT NULL,
    PRIMARY KEY (idpelicula, idcategoria),
    FOREIGN KEY (idpelicula) REFERENCES pelicula(id) ON DELETE CASCADE,
    FOREIGN KEY (idcategoria) REFERENCES categorias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Tabla Intermedia: Películas y Directores (Muchos a Muchos)
CREATE TABLE IF NOT EXISTS pelicula_directores (
    idpelicula INT NOT NULL,
    iddirector INT NOT NULL,
    PRIMARY KEY (idpelicula, iddirector),
    FOREIGN KEY (idpelicula) REFERENCES pelicula(id) ON DELETE CASCADE,
    FOREIGN KEY (iddirector) REFERENCES directores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tabla de Actores (Corregido el error de sintaxis previo)
CREATE TABLE IF NOT EXISTS actores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(250)
) ENGINE=InnoDB;

-- 9. Tabla Intermedia: Películas y Actores (Con el extra funcional del personaje)
CREATE TABLE IF NOT EXISTS pelicula_actores (
    idpelicula INT NOT NULL,
    idactor INT NOT NULL,
    personaje VARCHAR(100), -- Nombre del personaje que interpreta el actor
    PRIMARY KEY (idpelicula, idactor),
    FOREIGN KEY (idpelicula) REFERENCES pelicula(id) ON DELETE CASCADE,
    FOREIGN KEY (idactor) REFERENCES actores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Tabla de Reseñas / Comentarios
CREATE TABLE IF NOT EXISTS reseña (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idpelicula INT NOT NULL,
    idusuario INT NOT NULL,
    comentarios TEXT NOT NULL,
    fechaReseña DATE NOT NULL,
    punteo DECIMAL(5, 2),
    FOREIGN KEY (idpelicula) REFERENCES pelicula(id) ON DELETE CASCADE,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
