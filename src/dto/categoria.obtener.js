export default class CategoriaObtenerDTO {
    constructor(data) {
        this.data = { id: data.id, nombre: data.nombre, imagen_url: data.imagen_url || null };
    }
}
