export default class UsuarioCrearDTO {
    #nombre;
    #apellido;
    #email;
    #telefono;
    #contrasena;
    #role;

    constructor(data) {
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
        this.#email = data.email;
        this.#telefono = data.telefono || null; // Opcional si permite nulos
        this.#contrasena = data.contrasena;   // <-- Añadido crucial
        this.#role = data.role;
    }
    
    // Setters
    set nombre(nombre) { this.#nombre = nombre; }
    set apellido(apellido) { this.#apellido = apellido; }
    set email(email) { this.#email = email; }
    set telefono(telefono) { this.#telefono = telefono; }
    set contrasena(contrasena) { this.#contrasena = contrasena; }
    set role(role) { this.#role = role; }
 
    // Getters
    get nombre() { return this.#nombre; }
    get apellido() { return this.#apellido; }
    get email() { return this.#email; }
    get telefono() { return this.#telefono; }
    get contrasena() { return this.#contrasena; }
    get role() { return this.#role; }

    // Método .data para hacer el INSERT limpio en MySQL2
    get data() {
        return {
            nombre: this.#nombre,
            apellido: this.#apellido,
            email: this.#email,
            telefono: this.#telefono,
            contrasena: this.#contrasena,
            role: this.#role
        };
    }
}