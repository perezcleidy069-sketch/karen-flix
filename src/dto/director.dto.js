export default class DirectorDTO{
    #nombre;
    #apellido;
    
    constructor(data){
        this.#nombre=data.nombre:
        this.#apellido=data.apellido;
    }
    set nombre(nombre){this.#nombre=nombre}
    set apellido(apellido){this.#apellido=apellido}

    get nombre(){ return this.#nombre}
    get apellido(){ return this.#apellido }
}