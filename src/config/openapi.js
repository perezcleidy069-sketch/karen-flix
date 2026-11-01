const jsonRequest = (schema) => ({
    required: true,
    content: { 'application/json': { schema } }
});

const response = (description, schema = { $ref: '#/components/schemas/Message' }) => ({
    description,
    content: { 'application/json': { schema } }
});

const secured = (operation) => ({
    ...operation,
    security: [{ bearerAuth: [] }]
});

const idParameter = {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'integer', minimum: 1 }
};

const catalogPaths = (path, label) => ({
    [`/${path}`]: {
        get: {
            summary: `Listar ${label}`,
            responses: {
                200: response('Listado de registros', {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CatalogItem' }
                })
            }
        },
        post: secured({
            summary: `Crear ${label.slice(0, -1)}`,
            requestBody: jsonRequest({ $ref: '#/components/schemas/CatalogItemInput' }),
            responses: { 201: response('Registro creado'), 403: response('Solo administradores') }
        })
    },
    [`/${path}/{id}`]: {
        parameters: [idParameter],
        get: { summary: `Consultar ${label.slice(0, -1)}`, responses: { 200: response('Registro') } },
        put: secured({
            summary: `Actualizar ${label.slice(0, -1)}`,
            requestBody: jsonRequest({ $ref: '#/components/schemas/CatalogItemInput' }),
            responses: { 200: response('Registro actualizado'), 403: response('Solo administradores') }
        }),
        delete: secured({
            summary: `Eliminar ${label.slice(0, -1)}`,
            responses: { 200: response('Registro eliminado'), 409: response('Registro en uso') }
        })
    }
});

export default {
    openapi: '3.0.3',
    info: {
        title: 'Karen Flix API',
        version: '1.0.0',
        description: 'API de películas, series, usuarios, catálogos y reseñas. Las rutas `/api` anteriores siguen disponibles como alias.'
    },
    servers: [{ url: '/api/v1', description: 'API versionada' }],
    tags: [
        { name: 'Auth', description: 'Registro, login y sesión JWT' },
        { name: 'Películas', description: 'Catálogo, filtros, ranking y aprobación' },
        { name: 'Reseñas', description: 'Calificaciones, comentarios y votos' },
        { name: 'Categorías' },
        { name: 'Actores' },
        { name: 'Directores' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        },
        schemas: {
            Message: {
                type: 'object',
                properties: { mensaje: { type: 'string' }, error: { type: 'string' } }
            },
            RegisterInput: {
                type: 'object',
                required: ['nombre', 'email', 'contrasena'],
                properties: {
                    nombre: { type: 'string', maxLength: 60 },
                    apellido: { type: 'string', maxLength: 250 },
                    email: { type: 'string', format: 'email' },
                    contrasena: { type: 'string', minLength: 8, maxLength: 72 },
                    telefono: { type: 'string', maxLength: 20 },
                    avatar_url: { type: 'string', format: 'uri' },
                    solicitar_administrador: {
                        type: 'boolean',
                        description: 'Solicita revisión; nunca asigna el rol sin aprobación de un administrador'
                    },
                    codigo_administrador: {
                        type: 'string',
                        description: 'Código requerido cuando solicitar_administrador es true'
                    }
                }
            },
            LoginInput: {
                type: 'object',
                required: ['email', 'contrasena'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    contrasena: { type: 'string', maxLength: 72 },
                    codigo_administrador: {
                        type: 'string',
                        description: 'Requerido al iniciar sesión con una cuenta administradora'
                    }
                }
            },
            LoginResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    usuario: { type: 'object', properties: {
                        id: { type: 'integer' },
                        nombre: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['usuario', 'administrador'] }
                    } }
                }
            },
            MovieInput: {
                type: 'object',
                required: ['titulo', 'sinopsis', 'anio_estreno', 'idcategoria'],
                properties: {
                    titulo: { type: 'string', maxLength: 150 },
                    sinopsis: { type: 'string' },
                    anio_estreno: { type: 'integer', minimum: 1888 },
                    duracion_minutos: { type: 'integer', minimum: 1 },
                    idcategoria: { type: 'integer', minimum: 1 },
                    iddirector: { type: 'integer', minimum: 1, nullable: true },
                    imagen: { type: 'string', format: 'uri', nullable: true },
                    trailer_url: { type: 'string', format: 'uri', nullable: true },
                    tipo: { type: 'string', enum: ['pelicula', 'serie'] }
                }
            },
            Movie: {
                allOf: [
                    { $ref: '#/components/schemas/MovieInput' },
                    { type: 'object', properties: {
                        idpelicula: { type: 'integer' },
                        estado: { type: 'string', enum: ['pendiente', 'aprobada', 'rechazada'] },
                        calificacion_promedio: { type: 'number' },
                        total_resenas: { type: 'integer' },
                        ranking: {
                            type: 'number',
                            description: 'Promedio de puntuaciones + likes de reseñas - dislikes de reseñas'
                        }
                    } }
                ]
            },
            ReviewInput: {
                type: 'object',
                required: ['idpelicula', 'titulo', 'comentarios', 'puntaje'],
                properties: {
                    idpelicula: { type: 'integer', minimum: 1 },
                    titulo: { type: 'string', maxLength: 150 },
                    comentarios: { type: 'string', maxLength: 5000 },
                    puntaje: { type: 'integer', minimum: 1, maximum: 10 }
                }
            },
            ReviewUpdateInput: {
                type: 'object',
                required: ['titulo', 'comentarios', 'puntaje'],
                properties: {
                    titulo: { type: 'string', maxLength: 150 },
                    comentarios: { type: 'string', maxLength: 5000 },
                    puntaje: { type: 'integer', minimum: 1, maximum: 10 }
                }
            },
            Review: {
                allOf: [
                    { $ref: '#/components/schemas/ReviewInput' },
                    { type: 'object', properties: {
                        id: { type: 'integer' },
                        idusuario: { type: 'integer' },
                        fechaResena: { type: 'string', format: 'date' },
                        likes: { type: 'integer' },
                        dislikes: { type: 'integer' }
                    } }
                ]
            },
            ReviewVote: {
                type: 'object',
                required: ['voto'],
                properties: { voto: { type: 'string', enum: ['like', 'dislike'] } }
            },
            CatalogItem: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nombre: { type: 'string' },
                    apellido: { type: 'string', nullable: true },
                    imagen_url: { type: 'string', format: 'uri', nullable: true },
                    foto_url: { type: 'string', format: 'uri', nullable: true }
                }
            },
            CatalogItemInput: {
                type: 'object',
                required: ['nombre'],
                properties: {
                    nombre: { type: 'string', maxLength: 60 },
                    apellido: { type: 'string', maxLength: 250 },
                    imagen_url: { type: 'string', format: 'uri' },
                    foto_url: { type: 'string', format: 'uri' }
                }
            },
            PaginatedMovies: {
                type: 'object',
                properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Movie' } },
                    pagination: { type: 'object', properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' }
                    } }
                }
            }
        }
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'], summary: 'Registrar una cuenta (rol usuario)',
                requestBody: jsonRequest({ $ref: '#/components/schemas/RegisterInput' }),
                responses: {
                    201: response('Cuenta registrada'),
                    400: response('Datos inválidos'),
                    403: response('Código de administrador incorrecto'),
                    409: response('Correo duplicado'),
                    503: response('Solicitudes de administrador no configuradas')
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'], summary: 'Iniciar sesión y obtener JWT',
                requestBody: jsonRequest({ $ref: '#/components/schemas/LoginInput' }),
                responses: {
                    200: response('Token de acceso', { $ref: '#/components/schemas/LoginResponse' }),
                    401: response('Credenciales incorrectas'),
                    403: response('Código de administrador obligatorio o incorrecto'),
                    503: response('Acceso de administrador no configurado')
                }
            }
        },
        '/auth/me': {
            get: secured({ tags: ['Auth'], summary: 'Consultar usuario autenticado', responses: { 200: response('Usuario actual'), 401: response('Token inválido') } })
        },
        '/usuarios/solicitudes-administrador': {
            get: secured({
                tags: ['Auth'],
                summary: 'Listar solicitudes de administrador pendientes',
                responses: { 200: response('Solicitudes pendientes'), 403: response('Solo administradores') }
            })
        },
        '/usuarios/solicitudes-administrador/{id}': {
            parameters: [idParameter],
            patch: secured({
                tags: ['Auth'],
                summary: 'Aprobar o rechazar una solicitud de administrador',
                requestBody: jsonRequest({
                    type: 'object',
                    required: ['estado'],
                    properties: { estado: { type: 'string', enum: ['aprobada', 'rechazada'] } }
                }),
                responses: { 200: response('Solicitud resuelta'), 403: response('Solo administradores'), 409: response('Solicitud ya atendida') }
            })
        },
        '/peliculas': {
            get: {
                tags: ['Películas'], summary: 'Listar y filtrar películas/series',
                parameters: [
                    { name: 'categoria', in: 'query', schema: { type: 'integer' } },
                    { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['pelicula', 'serie'] } },
                    { name: 'buscar', in: 'query', schema: { type: 'string' } },
                    { name: 'orden', in: 'query', schema: { type: 'string', enum: ['ranking', 'popularidad', 'recientes'] } },
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } }
                ],
                responses: { 200: response('Página de películas aprobadas', { $ref: '#/components/schemas/PaginatedMovies' }) }
            },
            post: secured({
                tags: ['Películas'], summary: 'Proponer película; administradores la publican directamente',
                requestBody: jsonRequest({ $ref: '#/components/schemas/MovieInput' }),
                responses: { 201: response('Película creada o pendiente de aprobación'), 409: response('Título duplicado') }
            })
        },
        '/peliculas/{idpelicula}': {
            parameters: [{ ...idParameter, name: 'idpelicula' }],
            get: { tags: ['Películas'], summary: 'Detalle, reseñas y permiso de gestión de una película', responses: { 200: response('Película; incluye puede_gestionar para usuarios autenticados'), 404: response('No encontrada') } },
            put: secured({
                tags: ['Películas'], summary: 'Actualizar una película propia o administrar como admin',
                requestBody: jsonRequest({ $ref: '#/components/schemas/MovieInput' }),
                responses: { 200: response('Película actualizada'), 403: response('Sin permisos') }
            }),
            delete: secured({ tags: ['Películas'], summary: 'Eliminar película', responses: { 200: response('Película eliminada'), 403: response('Sin permisos') } })
        },
        '/peliculas/{idpelicula}/aprobacion': {
            parameters: [{ ...idParameter, name: 'idpelicula' }],
            patch: secured({
                tags: ['Películas'], summary: 'Aprobar o rechazar propuesta (administrador)',
                requestBody: jsonRequest({ type: 'object', required: ['estado'], properties: { estado: { type: 'string', enum: ['aprobada', 'rechazada'] } } }),
                responses: { 200: response('Estado actualizado'), 403: response('Solo administradores') }
            })
        },
        '/resenas': {
            get: {
                tags: ['Reseñas'], summary: 'Listar reseñas públicas de películas aprobadas',
                parameters: [{ name: 'idpelicula', in: 'query', schema: { type: 'integer' } }],
                responses: { 200: response('Reseñas', { type: 'array', items: { $ref: '#/components/schemas/Review' } }) }
            },
            post: secured({
                tags: ['Reseñas'], summary: 'Crear reseña y actualizar promedio transaccionalmente',
                requestBody: jsonRequest({ $ref: '#/components/schemas/ReviewInput' }),
                responses: { 201: response('Reseña creada'), 404: response('Película no disponible') }
            })
        },
        '/resenas/{id}': {
            parameters: [idParameter],
            get: { tags: ['Reseñas'], summary: 'Consultar reseña', responses: { 200: response('Reseña'), 404: response('No encontrada') } },
            put: secured({
                tags: ['Reseñas'], summary: 'Editar reseña propia y actualizar promedio',
                requestBody: jsonRequest({ $ref: '#/components/schemas/ReviewUpdateInput' }),
                responses: { 200: response('Reseña actualizada'), 403: response('No es tu reseña') }
            }),
            delete: secured({ tags: ['Reseñas'], summary: 'Eliminar reseña propia y actualizar promedio', responses: { 200: response('Reseña eliminada'), 403: response('No es tu reseña') } })
        },
        '/resenas/{id}/votos': {
            parameters: [idParameter],
            post: secured({
                tags: ['Reseñas'], summary: 'Votar like/dislike una vez por usuario',
                requestBody: jsonRequest({ $ref: '#/components/schemas/ReviewVote' }),
                responses: { 200: response('Voto registrado'), 403: response('No se puede votar una reseña propia') }
            }),
            delete: secured({ tags: ['Reseñas'], summary: 'Retirar el voto propio', responses: { 200: response('Voto eliminado') } })
        },
        ...catalogPaths('categorias', 'categorías'),
        ...catalogPaths('actores', 'actores'),
        ...catalogPaths('directores', 'directores')
    }
};
