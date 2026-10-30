export default class ResenaCrearDTO {
    constructor(data) {
        this.data = {
            idpelicula: data.idpelicula,
            titulo: data.titulo,
            comentarios: data.comentarios,
            puntaje: data.puntaje
        };
    }
}
