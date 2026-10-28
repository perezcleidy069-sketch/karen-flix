export default class UsuarioModel{
    #id;
    #nombre;
    #apellido;
    #email;
    #telefono;
    #contrasena;
    #role;
    #activo;
    #likes;
    #dislikes;

    constructor(data){
        this.#id=data.id;
        this.#nombre=data.nombre;
        this.#apellido=data.apellido;
        this.#email=data.email;
        this.#telefono=data.telefono;
        this.#contrasena=data.constrasena;
        this.#role=data.role;
        this.#activo=data.activo;
        this.#likes=data.likes;
        this.#dislikes=data.dislikes


    }

    obtenerDatos(){
        return{
            id:this.#id,
            nombre:this.#nombre,
            apellido:this.#apellido,
            email:this.#email,
            telefono:this.#telefono,
            contrasena:this.#contrasena,
            role:this.#role,
            activo:this.#activo,
            likes:this.#likes,
            dislikes:this.#dislikes
        }

    }
}