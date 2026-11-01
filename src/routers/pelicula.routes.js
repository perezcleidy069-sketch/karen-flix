import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { pool } from '../config/db.js';
import { autenticar, autenticarOpcional, soloAdministrador } from '../middlewares/auth.middleware.js';
import validarRequest from '../middlewares/validar-request.js';
import { calcularRanking } from '../utils/ranking.js';

const router = Router();
const camposPelicula = [
    body('titulo').trim().notEmpty().isLength({ max: 150 }),
    body('sinopsis').isString().trim().notEmpty().withMessage('La descripción es obligatoria'),
    body('anio_estreno').isInt({ min: 1888, max: new Date().getFullYear() + 5 }).toInt(),
    body('duracion_minutos').optional({ values: 'falsy' }).isInt({ min: 1 }).toInt(),
    body('idcategoria').isInt({ min: 1 }).toInt(),
    body('iddirector').optional({ values: 'falsy' }).isInt({ min: 1 }).toInt(),
    body('imagen').optional({ values: 'falsy' }).isURL({ require_protocol: true }),
    body('trailer_url').optional({ values: 'falsy' }).isURL({ require_protocol: true }),
    body('tipo').optional().isIn(['pelicula', 'serie']),
    validarRequest
];
const movieSummary = `
    SELECT p.idpelicula, p.titulo, p.sinopsis, p.anio_estreno, p.duracion_minutos,
           p.idcategoria, c.nombre AS categoria, p.iddirector,
           d.nombre AS director, d.apellido AS apellido_director,
           p.imagen, p.trailer_url, p.tipo, p.estado, p.created_at,
           p.calificacion_promedio,
           p.total_resenas,
           COALESCE(v.likes, 0) AS likes, COALESCE(v.dislikes, 0) AS dislikes,
           ROUND(
               p.calificacion_promedio + COALESCE(v.likes, 0) - COALESCE(v.dislikes, 0),
               2
           ) AS ranking
    FROM peliculas p
    INNER JOIN categorias c ON c.id = p.idcategoria
    LEFT JOIN directores d ON d.id = p.iddirector
    LEFT JOIN (
        SELECT re.idpelicula,
               SUM(vr.voto = 'like') AS likes,
               SUM(vr.voto = 'dislike') AS dislikes
        FROM resenas re
        LEFT JOIN resena_votos vr ON vr.idresena = re.id
        GROUP BY re.idpelicula
    ) v ON v.idpelicula = p.idpelicula
`;

async function listarPeliculas(req, res, next, orden = req.query.orden || 'ranking') {
    try {
        if (!['ranking', 'popularidad', 'recientes'].includes(orden)) {
            return res.status(400).json({ error: 'El orden debe ser ranking, popularidad o recientes' });
        }
        const conditions = [];
        const values = [];
        if (req.user?.role !== 'administrador') {
            conditions.push("p.estado = 'aprobada'");
        }
        if (req.query.categoria) {
            conditions.push('p.idcategoria = ?');
            values.push(req.query.categoria);
        }
        if (req.query.tipo) {
            conditions.push('p.tipo = ?');
            values.push(req.query.tipo);
        }
        if (req.query.buscar) {
            conditions.push('p.titulo LIKE ?');
            values.push(`%${req.query.buscar}%`);
        }
        const orderBy = {
            ranking: 'ranking DESC, total_resenas DESC',
            popularidad: '(likes + dislikes) DESC, total_resenas DESC, ranking DESC',
            recientes: 'p.created_at DESC'
        }[orden];
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const offset = (page - 1) * limit;
        const [[count]] = await pool.execute(
            `SELECT COUNT(*) AS total FROM peliculas p ${where}`,
            values
        );
        const [rows] = await pool.execute(
            `${movieSummary} ${where} ORDER BY ${orderBy}, p.titulo ASC LIMIT ? OFFSET ?`,
            [...values, limit, offset]
        );
        const total = Number(count.total);
        return res.json({
            data: rows,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return next(error);
    }
}

const validarFiltrosPeliculas = [
    query('categoria').optional().isInt({ min: 1 }),
    query('tipo').optional().isIn(['pelicula', 'serie']),
    query('buscar').optional().isString().isLength({ max: 100 }),
    query('orden').optional().isIn(['ranking', 'popularidad', 'recientes']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    validarRequest
];

async function validarTituloUnico(req, res, next) {
    try {
        const values = [req.body.titulo];
        let excludeCurrentMovie = '';
        if (req.params.idpelicula) {
            excludeCurrentMovie = ' AND idpelicula <> ?';
            values.push(req.params.idpelicula);
        }
        const [matches] = await pool.execute(
            `SELECT idpelicula FROM peliculas WHERE titulo = ?${excludeCurrentMovie} LIMIT 1`,
            values
        );
        if (matches.length) {
            return res.status(409).json({ error: 'Ya existe una película o serie con ese título' });
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

router.get('/', autenticarOpcional, validarFiltrosPeliculas, (req, res, next) => listarPeliculas(req, res, next));
router.get('/ranking', autenticarOpcional, validarFiltrosPeliculas, (req, res, next) => listarPeliculas(req, res, next, 'ranking'));
router.get('/popularidad', autenticarOpcional, validarFiltrosPeliculas, (req, res, next) => listarPeliculas(req, res, next, 'popularidad'));

router.get('/:idpelicula', autenticarOpcional, [
    param('idpelicula').isInt({ min: 1 }),
    validarRequest
], async (req, res, next) => {
    try {
        const [movies] = await pool.execute(
            `${movieSummary} WHERE p.idpelicula = ? AND (p.estado = 'aprobada' OR ? = 'administrador')`,
            [req.params.idpelicula, req.user?.role || '']
        );
        if (!movies.length) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        const [[reviews], [ownership]] = await Promise.all([
            pool.execute(
                `SELECT r.id, r.titulo, r.comentarios, r.puntaje, r.fechaResena,
                        u.id AS idusuario, u.nombre AS usuario,
                        (SELECT COUNT(*) FROM resena_votos WHERE idresena = r.id AND voto = 'like') AS likes,
                        (SELECT COUNT(*) FROM resena_votos WHERE idresena = r.id AND voto = 'dislike') AS dislikes
                 FROM resenas r
                 INNER JOIN usuarios u ON u.id = r.idusuario
                 WHERE r.idpelicula = ?
                 ORDER BY r.fechaResena DESC`,
                [req.params.idpelicula]
            ),
            pool.execute(
                'SELECT creada_por FROM peliculas WHERE idpelicula = ?',
                [req.params.idpelicula]
            )
        ]);
        return res.json({
            ...movies[0],
            puede_editar: Boolean(req.user && (
                req.user.role === 'administrador' ||
                Number(ownership[0]?.creada_por) === Number(req.user.id)
            )),
            ranking: calcularRanking({
                promedio: movies[0].calificacion_promedio,
                likes: movies[0].likes,
                dislikes: movies[0].dislikes
            }),
            resenas: reviews
        });
    } catch (error) {
        return next(error);
    }
});

router.post('/', autenticar, camposPelicula, validarTituloUnico, async (req, res, next) => {
    try {
        const { titulo, sinopsis = null, anio_estreno = null, duracion_minutos = null,
            idcategoria, iddirector = null, imagen = null, trailer_url = null, tipo = 'pelicula' } = req.body;
        const admin = req.user.role === 'administrador';
        const [result] = await pool.execute(
            `INSERT INTO peliculas
             (titulo, sinopsis, anio_estreno, duracion_minutos, idcategoria, iddirector,
              imagen, trailer_url, tipo, estado, creada_por, aprobada_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo, sinopsis, anio_estreno, duracion_minutos, idcategoria, iddirector,
                imagen, trailer_url, tipo, admin ? 'aprobada' : 'pendiente',
                req.user.id, admin ? req.user.id : null
            ]
        );
        return res.status(201).json({
            id: result.insertId,
            estado: admin ? 'aprobada' : 'pendiente',
            mensaje: admin ? 'Película creada y publicada correctamente' : 'Película propuesta; un administrador debe aprobarla'
        });
    } catch (error) {
        return next(error);
    }
});

router.put('/:idpelicula', autenticar, [
    param('idpelicula').isInt({ min: 1 }),
    ...camposPelicula
], validarTituloUnico, async (req, res, next) => {
    try {
        const [rows] = await pool.execute(
            'SELECT creada_por, estado FROM peliculas WHERE idpelicula = ?',
            [req.params.idpelicula]
        );
        const movie = rows[0];
        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        if (req.user.role !== 'administrador' && movie.creada_por !== req.user.id) {
            return res.status(403).json({ error: 'Solo puedes modificar tus propias propuestas' });
        }
        const { titulo, sinopsis = null, anio_estreno = null, duracion_minutos = null,
            idcategoria, iddirector = null, imagen = null, trailer_url = null, tipo = 'pelicula' } = req.body;
        const admin = req.user.role === 'administrador';
        await pool.execute(
            `UPDATE peliculas
             SET titulo = ?, sinopsis = ?, anio_estreno = ?, duracion_minutos = ?, idcategoria = ?,
                 iddirector = ?, imagen = ?, trailer_url = ?, tipo = ?,
                 estado = ?, aprobada_por = ?
             WHERE idpelicula = ?`,
            [
                titulo, sinopsis, anio_estreno, duracion_minutos, idcategoria, iddirector,
                imagen, trailer_url, tipo, admin ? movie.estado : 'pendiente',
                admin && movie.estado === 'aprobada' ? req.user.id : null, req.params.idpelicula
            ]
        );
        return res.json({ mensaje: 'Película actualizada correctamente', requiere_aprobacion: !admin });
    } catch (error) {
        return next(error);
    }
});

router.patch('/:idpelicula/aprobacion', autenticar, soloAdministrador, [
    param('idpelicula').isInt({ min: 1 }),
    body('estado').isIn(['aprobada', 'rechazada']).withMessage('El estado debe ser aprobada o rechazada'),
    validarRequest
], async (req, res, next) => {
    try {
        const [movies] = await pool.execute('SELECT idpelicula FROM peliculas WHERE idpelicula = ?', [req.params.idpelicula]);
        if (!movies.length) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        await pool.execute(
            'UPDATE peliculas SET estado = ?, aprobada_por = ? WHERE idpelicula = ?',
            [req.body.estado, req.body.estado === 'aprobada' ? req.user.id : null, req.params.idpelicula]
        );
        return res.json({ mensaje: `Película ${req.body.estado} correctamente` });
    } catch (error) {
        return next(error);
    }
});

router.delete('/:idpelicula', autenticar, [
    param('idpelicula').isInt({ min: 1 }),
    validarRequest
], async (req, res, next) => {
    try {
        const [rows] = await pool.execute('SELECT creada_por FROM peliculas WHERE idpelicula = ?', [req.params.idpelicula]);
        const movie = rows[0];
        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        if (req.user.role !== 'administrador' && movie.creada_por !== req.user.id) {
            return res.status(403).json({ error: 'Solo puedes eliminar tus propias propuestas' });
        }
        await pool.execute('DELETE FROM peliculas WHERE idpelicula = ?', [req.params.idpelicula]);
        return res.json({ mensaje: 'Película eliminada correctamente' });
    } catch (error) {
        return next(error);
    }
});

export default router;
