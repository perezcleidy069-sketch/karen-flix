import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import passport from './config/passport.js';
import openApiSpec from './config/openapi.js';
import usuarioRoutes from './routers/usuario.routes.js';
import peliculaRoutes from './routers/pelicula.routes.js';
import resenaRoutes from './routers/resena.routes.js';
import categoriaRoutes from './routers/categoria.routes.js';
import actorRoutes from './routers/actor.routes.js';
import directorRoutes from './routers/director.routes.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});
app.disable('x-powered-by');
app.use(cors({
    origin: allowedOrigins.length
        ? (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin))
        : '*'
}));
app.use(express.json({ limit: '1mb' }));
app.use(passport.initialize());
app.use('/api', apiLimiter);
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', version: 'v1' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api/v1/auth', usuarioRoutes);
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/peliculas', peliculaRoutes);
app.use('/api/v1/resenas', resenaRoutes);
app.use('/api/v1/categorias', categoriaRoutes);
app.use('/api/v1/actores', actorRoutes);
app.use('/api/v1/directores', directorRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/peliculas', peliculaRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/actores', actorRoutes);
app.use('/api/directores', directorRoutes);
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error.statusCode) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ya existe un registro con esos datos' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'La categoría, director o usuario indicado no existe' });
    }
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'No se puede eliminar el registro porque está en uso' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
