export default class peliculaCrearDTO {
    #titulo;
    #sinopsis;
    #anio_estreno;
    #duracion_minutos;
    #idcategoria;
    #idDirector;
    #imagen;
    #trailer_url;

    constructor(data) {
        this.#titulo = data.titulo;
        this.#sinopsis = data.sinopsis;
        this.#anio_estreno = data.anio_estreno;
        this.#duracion_minutos = data.duracion_minutos;
        this.#idcategoria = data.idcategoria;
        this.#idDirector = data.idDirector;
        this.#imagen = data.imagen;
        this.#trailer_url = data.trailer_url;
    }

    set titulo(titulo) { this.#titulo = titulo; }
    set sinopsis(sinopsis) { this.#sinopsis = sinopsis; }
    set anio_estreno(anio_estreno) { this.#anio_estreno = anio_estreno; }
    set duracion_minutos(duracion_minutos) { this.#duracion_minutos = duracion_minutos; }
    set idcategoria(idcategoria) { this.#idcategoria = idcategoria; }
    set idDirector(idDirector) { this.#idDirector = idDirector; }
    set imagen(imagen) { this.#imagen = imagen; }
    set trailer_url(trailer_url) { this.#trailer_url = trailer_url; }

    get titulo() { return this.#titulo; }
    get sinopsis() { return this.#sinopsis; }
    get anio_estreno() { return this.#anio_estreno; }
    get duracion_minutos() { return this.#duracion_minutos; }
    get idcategoria() { return this.#idcategoria; }
    get idDirector() { return this.#idDirector; }
    get imagen() { return this.#imagen; }
    get trailer_url() { return this.#trailer_url; }


    get data() {
        return {
            titulo: this.#titulo,
            sinopsis: this.#sinopsis,
            anio_estreno: this.#anio_estreno,
            duracion_minutos: this.#duracion_minutos,
            idcategoria: this.#idcategoria,
            idDirector: this.#idDirector,
            imagen: this.#imagen,
            trailer_url: this.#trailer_url
        };
    }
}