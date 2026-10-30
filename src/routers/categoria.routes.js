import crearRutasCatalogo from './catalogo.routes.js';

export default crearRutasCatalogo({
    tabla: 'categorias',
    camposImagen: 'imagen_url',
    conApellido: false,
    nombreUnico: true
});
