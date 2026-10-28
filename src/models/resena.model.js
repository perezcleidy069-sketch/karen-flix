export default class ResenaModel{
    #id;
    #idpelicula;
    #idusuario;
    #comentarios;
    #fechaResena;
    #punteo;
    
    constructor(data){
        this.#id=data.id;
        this.#idpelicula=data.idpelicula;
        this.#idusuario=data.idusuario;
        this.#comentarios=data.comentarios;
        this.#fechaResena=fechaResena;
        this.#punteo=data.punteo;
    }

    obtenerDatos(){
        return{
            id:this.#id,
            idpelicula:this.#idpelicula,
            idusuario:this.#idusuario,
            comentarios:this.#comentarios,
            fechaResena:this.#fechaResena,
            punteo:this.#punteo
        }
    }

}