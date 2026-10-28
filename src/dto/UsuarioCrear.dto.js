
export default class UsuarioCrearDTO{
    #nombre;
    #apellido;
    #email;
    #telefono;
    #role;
}
 constructor(data){
        this.#nombre=data.nombre:
        this.#apellido=data.apellido;
        this.#email=data.email;
        this.#telefono=data.telefono;
        this.#role=data.role;
    }
    
    set nombre(nombre){this.#nombre=nombre}
    set apellido(apellido){this.#apellido=apellido}
    set email(email){this.#email=email_email}
    set telefono(telefono){this.#telefono=telefono}
    set role(role){this.#role=role}
 
    get nombre(){ return this.#nombre}
    get apellido(){ return this.#apellido }
    get email(){ return this.#email }
    get telefono(){ return this.#telefono }
    get role(){ return this.#role }
    