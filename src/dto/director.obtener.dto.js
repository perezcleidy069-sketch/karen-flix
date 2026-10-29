export default class DirectorObtenerDTO {
    #iddirector;
    #nombre;
    #apellido;
    
    constructor(data) {
        this.#iddirector = data.iddirector || data.id;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
    }

    set iddirector(iddirector) { this.#iddirector = iddirector; }
    set nombre(nombre) { this.#nombre = nombre; }
    set apellido(apellido) { this.#apellido = apellido; }

    get iddirector() { return this.#iddirector; }
    get nombre() { return this.#nombre; }
    get apellido() { return this.#apellido; }


    get data() {
        return {
            iddirector: this.#iddirector,
            nombre: this.#nombre,
            apellido: this.#apellido
        };
    }
}