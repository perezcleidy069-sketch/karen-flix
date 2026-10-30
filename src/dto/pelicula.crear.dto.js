export default class PeliculaCrearDTO {
    constructor(data) {
        this.data = {
            titulo: data.titulo,
            sinopsis: data.sinopsis || null,
            anio_estreno: data.anio_estreno || null,
            duracion_minutos: data.duracion_minutos || null,
            idcategoria: data.idcategoria,
            iddirector: data.iddirector || null,
            imagen: data.imagen || null,
            trailer_url: data.trailer_url || null,
            tipo: data.tipo || 'pelicula'
        };
    }
}
