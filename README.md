# Karen Flix — Backend API

API REST para una plataforma de películas y series. Este repositorio contiene únicamente el backend; el frontend se desarrolla y consume la API desde un repositorio independiente. Está construida con Node.js, Express y MySQL, con rutas versionadas, autenticación JWT y separación entre routers, controladores, modelos, servicios y utilidades.

## Patrones de diseño

- **Factory:** `src/factory/usuario.factory.js` construye los datos de registro del usuario con valores opcionales predeterminados y asigna siempre el rol `usuario`, evitando que el registro público elija el rol. La ruta de registro lo usa antes de guardar en MySQL.
- **Observer:** `src/observer/usuario.observer.js` permite suscribir observadores a eventos de usuario. Al completar un registro, la ruta notifica `usuario_registrado`; el observador incluido registra el ID creado. Se pueden añadir otros suscriptores, por ejemplo para notificaciones, sin acoplarlos a la ruta.

## Requisitos previos

- Node.js 20 o superior.
- MySQL 8 activo y accesible.
- npm.

## Variables de entorno

Copia `.env.example` a `.env` y configura los valores de tu entorno:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contrasena
DB_NAME=greekrang
DB_PORT=3306
JWT_SECRET=usa-una-clave-aleatoria-de-al-menos-32-caracteres
JWT_EXPIRES_IN=1d
ADMIN_REQUEST_CODE=003
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

`CORS_ORIGINS` es una lista separada por comas. Si se deja vacía, CORS permite cualquier origen; define explícitamente los orígenes permitidos en producción.

## Instalación y ejecución

1. Instala dependencias: `npm install`.
2. Crea la base y tablas ejecutando `src/database/schema.sql`.
3. Para mostrar los datos de ejemplo, ejecuta una vez `src/database/data.sql` después del esquema. El backend no ejecuta este archivo automáticamente al iniciar. No vuelvas a ejecutar el archivo completo sobre los mismos datos, porque los catálogos y las películas tienen IDs y nombres únicos.
4. Inicia en desarrollo: `npm run dev`. Para producción: `npm start`.
5. Comprueba el servicio en `GET /api/v1/health`.

El esquema está preparado para una instalación nueva. `CREATE TABLE IF NOT EXISTS` no transforma tablas de instalaciones anteriores; respalda y migra esos datos antes de aplicar esta estructura.

Si ya tienes instalada la base de datos, ejecuta una sola vez `src/database/migration_solicitud_admin.sql` en MySQL Workbench para añadir el estado de solicitudes de administrador. No la ejecutes si la columna `solicitud_admin` ya existe.

Si ya importaste el catálogo pero faltan reseñas o votos, ejecuta únicamente desde `INSERT IGNORE INTO resenas` hasta el final de `src/database/data.sql`. Ese bloque requiere que los 52 usuarios de demostración ya existan y agrega reseñas y votos de ejemplo sin duplicarlos.

El registro público siempre crea una cuenta con rol `usuario`. Si se solicita el rol de administrador, la solicitud queda pendiente hasta que un administrador la apruebe desde el panel de GeekRank. Al iniciar sesión, las cuentas con rol `administrador` también deben enviar `codigo_administrador` con el valor configurado en `ADMIN_REQUEST_CODE`; esto no concede el rol a cuentas normales. Para designar manualmente el primer administrador, actualiza su rol desde MySQL:

```sql
UPDATE greekrang.usuarios SET `role` = 'administrador' WHERE email = 'admin@ejemplo.com';
```

Los usuarios de demostración existentes en `data.sql` conservan su contraseña inicial de ejemplo. En el primer inicio de sesión exitoso, la API la migra a bcrypt. Las cuentas nuevas siempre se guardan con bcrypt.

## Autenticación

Inicia sesión con `POST /api/v1/auth/login` y envía el token en las rutas privadas:

```http
Authorization: Bearer <token>
```

## Endpoints principales

La API actual está bajo `/api/v1`. Los prefijos anteriores `/api/...` se mantienen como alias por compatibilidad.

| Método | Endpoint | Acceso |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Público; crea usuario y opcionalmente solicita rol de administrador |
| `POST` | `/api/v1/auth/login` | Público; devuelve JWT |
| `GET` | `/api/v1/auth/me` | Autenticado |
| `GET` | `/api/v1/usuarios/solicitudes-administrador` | Administrador |
| `PATCH` | `/api/v1/usuarios/solicitudes-administrador/:id` | Administrador; aprueba o rechaza |
| `GET` | `/api/v1/peliculas?page=1&limit=20&categoria=1&orden=popularidad` | Público; solo aprobadas |
| `POST` | `/api/v1/peliculas` | Autenticado; propuesta pendiente para usuarios, aprobación directa para administradores |
| `PATCH` | `/api/v1/peliculas/:idpelicula/aprobacion` | Administrador |
| `GET`, `POST` | `/api/v1/resenas` | Lectura pública; creación autenticada |
| `PUT`, `DELETE` | `/api/v1/resenas/:id` | Propietario de la reseña o administrador |
| `POST`, `DELETE` | `/api/v1/resenas/:id/votos` | Autenticado; no se permite votar la reseña propia |
| `GET` | `/api/v1/categorias`, `/api/v1/actores`, `/api/v1/directores` | Público |
| `POST`, `PUT`, `DELETE` | Rutas de categorías, actores y directores | Administrador |

Las reseñas aceptan `titulo`, `comentarios`, `idpelicula` y `puntaje` entero entre 1 y 10. Los votos únicos se guardan en `resena_votos`. Crear, editar o eliminar reseñas recalcula dentro de una transacción el promedio y total de reseñas de la película.

El ranking se calcula como promedio de puntuaciones más likes menos dislikes. Para ordenamiento se admiten `ranking`, `popularidad` y `recientes`; la respuesta del listado incluye `data` y metadatos de `pagination`.

### Ejemplos de uso

Registro:

```http
POST /api/v1/auth/register
Content-Type: application/json

{"nombre":"Ana","email":"ana@example.com","contrasena":"ClaveSegura123","solicitar_administrador":true,"codigo_administrador":"003"}
```

`solicitar_administrador` es opcional. Cuando es `true`, también se exige el código configurado en `ADMIN_REQUEST_CODE`; la cuenta se registra como `usuario` y el rol de administrador solo se asigna tras la aprobación de un administrador. Después, para iniciar sesión como administrador, incluye `codigo_administrador` en la petición de login.

Ejemplo de inicio de sesión administrador:

```json
{"email":"admin@ejemplo.com","contrasena":"ClaveSegura123","codigo_administrador":"003"}
```

Los tokens de administrador emitidos antes de este requisito no conservan permisos administrativos; hay que iniciar sesión de nuevo con el código.

Propuesta de película (con token de usuario):

```http
POST /api/v1/peliculas
Authorization: Bearer <token>
Content-Type: application/json

{"titulo":"Mi película","sinopsis":"Una historia de ejemplo.","anio_estreno":2025,"idcategoria":1}
```

La respuesta indica `estado: "pendiente"` para usuarios y `estado: "aprobada"` para administradores. Para votar una reseña: `POST /api/v1/resenas/:id/votos` con `{"voto":"like"}` o `{"voto":"dislike"}`.

## Swagger

La especificación OpenAPI y la interfaz interactiva están disponibles en `/api-docs`.
