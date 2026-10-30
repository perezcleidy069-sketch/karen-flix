export default class DirectorObtenerDTO {
    constructor(data) {
        this.data = {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            foto_url: data.foto_url
        };
    }
}
