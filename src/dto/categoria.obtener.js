export default class CategoriaObtenerDTO {
    #id;
    #nombre;

    constructor(data) {
        this.#id = data.id || data.id;
        this.#nombre = data.nombre;
    }

    set idcategoria(idcategoria) { this.#id = id; }
    set nombre(nombre) { this.#nombre = nombre; }

    get idcategoria() { return this.#id; }
    get nombre() { return this.#nombre; }

    // Objeto plano listo para enviar mediante la API HTTP (res.json)
    get data() {
        return {
            idcategoria: this.#id,
            nombre: this.#nombre
        };
    }
}