export default class ActorCrearDTO {
    constructor(data) {
        this.data = {
            nombre: data.nombre,
            apellido: data.apellido || null,
            foto_url: data.foto_url || null
        };
    }
}
