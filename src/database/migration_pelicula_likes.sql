USE greekrang;

CREATE TABLE IF NOT EXISTS pelicula_likes (
    idpelicula INT NOT NULL,
    idusuario INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idpelicula, idusuario),
    FOREIGN KEY (idpelicula) REFERENCES peliculas(idpelicula) ON DELETE CASCADE,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
