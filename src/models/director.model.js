export default class DirectorModel{
    #id;
    #nombre;
    #apellido;

    constructor(data){
        this.#id=data.id;
        this.#nombre=data.nombre;
        this.#apellido=data.apellido;

    }

    obtenerDatos(){
        return{
            id:this.#id,
            nombre:this.#nombre,
            apellido:this.#apellido
        }
    }
}