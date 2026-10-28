export default class peliculaCrearDTO{
    #titulo;
    #sinopsis;
    #anio_estreno;
    #duracion_minutos;
    #dcategoria;
    #idDirector;
    #imagen;
    #trailer_url;
}
 constructor(data){
        this.#titulo=data.titulo:
        this.#sinopsis=data.sinopsis;
        this.#anio_estreno=data.anio_estreno;
        this.#duracion_minuto=data.duracion_minuto;
        this.#idcategoria=data.;idcategoria;
        this.#idDirector=data.idDirector;
        this.#imagen=data.imagen;
        this.#trailer_url=data.trailer_url;
        
    }
    
    set titulo(titulo){this.#titulo=titulo}
    set sinoposis(sinoposis){this.#sinopsis=sinopsis}
    set anio(anio){this.#anio_estreno=anio_estreno}
    set duracion_minuto(duracion_minuto){this.#duracion_minuto=duracion_minuto}
    set idcategoria(idcategoria){this.#idcategoria=idcategoria}
    set idDirector(director){this.#idDirector=idDirector}
    set imagen(imagen){this.#imagen=imagen}
    set tariler_url(trailer_url){this.#trailer_url=trailer_url}

    get titulo(){ return this.#titulo}
    get sinoposis(){ return this.#sinoposis }
    get anio_estreno(){ return this.#anio_estreno }
    get duracio_minutos(){ return this.#duracion_minutos }
    get idcategoria(){ return this.#idcategoria }
    get idDirector(){ return this.#idDirector }
    get imagen(){ return this.#imagen }
    get trailer_url(){ return this.#trailer_url }
          



