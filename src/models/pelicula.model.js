export default class PeliculaModel{
    #id;
    #titulo;
    #sinopsis;
    #anio_estreno;
    #idcategoria;
    #idDirector;
    #image;
    #trailer_url;

    constructor(data){
        this.#id=data.id;
        this.#titulo=data.titulo;
        this.#sinopsis=data.sinopsis;
        this.#anio_estreno=data.anio_estreno;
        this.#idcategoria=data.idcategoria;
        this.#idDirector=data.idDirector;
        this.#image=data.image;
        this.#trailer_url=data.trailer_url;
    }

    obtenerDatos(){
        return{
            id:this.#id,
            titulo:this.#titulo,
            sinopsis:this.#sinopsis,
            anio_estreno:this.#anio_estreno,
            idcategoria:this.#idcategoria,
            idDIrector:this.#idDirector,
            image:this.#image,
            trailer_url:this.#trailer_url
        }
    }
}