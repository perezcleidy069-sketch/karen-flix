export default class UsuarioCrearDTO {
    constructor(data) {
        this.data = {
            nombre: data.nombre,
            apellido: data.apellido || null,
            email: data.email,
            telefono: data.telefono || null,
            contrasena: data.contrasena,
            avatar_url: data.avatar_url || null
        };
    }
}
