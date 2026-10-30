export default class ResenaObtenerDTO {
    constructor(data) {
        this.data = {
            id: data.id,
            idpelicula: data.idpelicula,
            idusuario: data.idusuario,
            titulo: data.titulo,
            comentarios: data.comentarios,
            fechaResena: data.fechaResena,
            puntaje: data.puntaje
        };
    }
}
