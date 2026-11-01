export function crearUsuarioRegistro({
    nombre,
    apellido = null,
    email,
    telefono = null,
    contrasena,
    avatar_url = null
}) {
    return {
        nombre,
        apellido,
        email,
        telefono,
        contrasena,
        role: 'usuario',
        avatar_url
    };
}