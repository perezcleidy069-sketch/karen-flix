export default class UsuarioObtenerDTO {
    constructor(data) {
        this.data = {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            role: data.role,
            activo: Boolean(data.activo),
            avatar_url: data.avatar_url,
            created_at: data.created_at
        };
    }
}
