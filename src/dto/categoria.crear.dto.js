export default class CategoriaCrearDTO {
    #idcategoria;
    #nombre;

    constructor(data) {
        this.#idcategoria = data.idcategoria || data.id;
        this.#nombre = data.nombre;
    }

    set idcategoria(idcategoria) { this.#idcategoria = idcategoria; }
    set nombre(nombre) { this.#nombre = nombre; }

    get idcategoria() { return this.#idcategoria; }
    get nombre() { return this.#nombre; }

    // Objeto plano útil para el INSERT en MySQL2
    get data() {
        return {
            idcategoria: this.#idcategoria,
            nombre: this.#nombre
        };
    }
}