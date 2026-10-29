export default class ActorCrearDTO {
    #id;
    #nombre;
    #apellido;
    #imagen_url;

    constructor(data) {
        this.#id = data.id || null;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;

    }

    set id(id) { this.#id = id; }
    set nombre(nombre) { this.#nombre = nombre; }
    set apellido(apellido) { this.#apellido = apellido; }

    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get apellido() { return this.#apellido; }

    get data() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            apellido: this.#apellido
        };
    }
}