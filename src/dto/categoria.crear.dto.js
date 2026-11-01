export default class CategoriaCrearDTO {
    constructor(data) {
        this.data = { nombre: data.nombre, imagen_url: data.imagen_url || null };
    }
}
