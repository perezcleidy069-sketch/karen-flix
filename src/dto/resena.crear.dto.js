export default class peliculaCrearDTO {
    #idpelicula;
    #idusuario;
    #comentarios;
    #fechaReseña;
    #punteo;

    constructor(data) {
        this.#idpelicula = data.idpelicula;
        this.#idusuario = data.idusuario;
        this.#comentarios = data.comentarios;
        this.#fechaReseña = data.fechaReseña;
        this.#punteo = data.punteo; 
    }

    set idpelicula(idpelicula) { this.#idpelicula = idpelicula; }
    set idusuario(idusuario) { this.#idusuario = idusuario; }
    set comentarios(comentarios) { this.#comentarios = comentarios; }
    set fechaReseña(fechaReseña) { this.#fechaReseña = fechaReseña; }
    set punteo(punteo) { this.#punteo = punteo; }

    get idpelicula() { return this.#idpelicula; }
    get idusuario() { return this.#idusuario; }
    get comentarios() { return this.#comentarios; }
    get fechaReseña() { return this.#fechaReseña; }
    get punteo() { return this.#punteo; }

    get data() {
        return {
            idpelicula: this.#idpelicula,
            idusuario: this.#idusuario,
            comentarios: this.#comentarios,
            fechaReseña: this.#fechaReseña,
            punteo: this.#punteo
        };
    }
}