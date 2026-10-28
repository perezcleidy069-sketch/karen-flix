export default class ActoresModel{
    #id;
    #nombre;
    #apellido;

    constructor(data){
        this.#id=data.id;
        this.#nombre=data.nombre;
        this.#apellido=data.apellido;

    }

    obtenerDatos(data){
        return {
            id:this.#id,
            nombre:this.#nombre,
            apellido:this.#apellido
        }

    }
}