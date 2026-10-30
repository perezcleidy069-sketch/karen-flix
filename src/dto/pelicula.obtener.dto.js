export default class PeliculaObtenerDTO {
    constructor(data) {
        this.data = {
            idpelicula: data.idpelicula,
            titulo: data.titulo,
            sinopsis: data.sinopsis,
            anio_estreno: data.anio_estreno,
            duracion_minutos: data.duracion_minutos,
            idcategoria: data.idcategoria,
            iddirector: data.iddirector,
            imagen: data.imagen,
            trailer_url: data.trailer_url,
            tipo: data.tipo,
            estado: data.estado
        };
    }
}
