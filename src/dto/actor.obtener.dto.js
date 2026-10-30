export default class ActorObtenerDTO {
    constructor(data) {
        this.data = {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            foto_url: data.foto_url
        };
    }
}
