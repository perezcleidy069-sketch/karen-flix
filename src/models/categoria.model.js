export default class CategoriaModel{
    #id;
    #nombre;

    constructor(data){
        this.#id=data.id;
        this.#nombre=data.nombre
    }

    obtenerDatos(){
        return{
            id:this.#id,
            nombre:this.#nombre
        }
    }
}