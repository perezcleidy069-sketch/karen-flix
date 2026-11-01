import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { pool } from '../config/db.js';
import { autenticar, autenticarOpcional } from '../middlewares/auth.middleware.js';
import validarRequest from '../middlewares/validar-request.js';
import {
    actualizarResena,
    crearResena,
    eliminarResena,
    eliminarVoto,
    registrarVoto
} from '../services/resena.service.js';

const router = Router();
const reviewSelect = `
    SELECT r.id, r.idpelicula, r.idusuario, r.titulo, r.comentarios, r.fechaResena,
           r.puntaje, u.nombre AS usuario,
           (SELECT COUNT(*) FROM resena_votos WHERE idresena = r.id AND voto = 'like') AS likes,
           (SELECT COUNT(*) FROM resena_votos WHERE idresena = r.id AND voto = 'dislike') AS dislikes
    FROM resenas r
    INNER JOIN usuarios u ON u.id = r.idusuario
    INNER JOIN peliculas p ON p.idpelicula = r.idpelicula
`;

router.get('/', [
    query('idpelicula').optional().isInt({ min: 1 }),
    validarRequest
], autenticarOpcional, async (req, res, next) => {
    try {
        const conditions = [];
        const values = [];
        if (req.user?.role !== 'administrador') {
            conditions.push("p.estado = 'aprobada'");
        }
        if (req.query.idpelicula) {
            conditions.push('r.idpelicula = ?');
            values.push(req.query.idpelicula);
        }
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const [rows] = await pool.execute(`${reviewSelect} ${where} ORDER BY r.fechaResena DESC`, values);
        return res.json(rows);
    } catch (error) {
        return next(error);
    }
});

router.get('/:id', autenticarOpcional, [param('id').isInt({ min: 1 }), validarRequest], async (req, res, next) => {
    try {
        const visibility = req.user?.role === 'administrador' ? '' : " AND p.estado = 'aprobada'";
        const [rows] = await pool.execute(`${reviewSelect} WHERE r.id = ?${visibility}`, [req.params.id]);
        if (!rows.length) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        return res.json(rows[0]);
    } catch (error) {
        return next(error);
    }
});

router.post('/', autenticar, [
    body('idpelicula').isInt({ min: 1 }).toInt(),
    body('titulo').trim().notEmpty().isLength({ max: 150 }),
    body('comentarios').trim().notEmpty().isLength({ max: 5000 }),
    body('puntaje').isInt({ min: 1, max: 10 }).toInt(),
    validarRequest
], async (req, res, next) => {
    try {
        const result = await crearResena({
            ...req.body,
            idusuario: req.user.id
        });
        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

router.put('/:id', autenticar, [
    param('id').isInt({ min: 1 }),
    body('titulo').trim().notEmpty().isLength({ max: 150 }),
    body('comentarios').trim().notEmpty().isLength({ max: 5000 }),
    body('puntaje').isInt({ min: 1, max: 10 }).toInt(),
    validarRequest
], async (req, res, next) => {
    try {
        const result = await actualizarResena({
            ...req.body,
            id: Number(req.params.id),
            idusuario: req.user.id,
            role: req.user.role
        });
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

router.delete('/:id', autenticar, [param('id').isInt({ min: 1 }), validarRequest], async (req, res, next) => {
    try {
        const result = await eliminarResena({
            id: Number(req.params.id),
            idusuario: req.user.id,
            role: req.user.role
        });
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

router.post('/:id/votos', autenticar, [
    param('id').isInt({ min: 1 }),
    body('voto').isIn(['like', 'dislike']).withMessage('El voto debe ser like o dislike'),
    validarRequest
], async (req, res, next) => {
    try {
        const result = await registrarVoto({
            idresena: Number(req.params.id),
            idusuario: req.user.id,
            voto: req.body.voto
        });
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

router.delete('/:id/votos', autenticar, [param('id').isInt({ min: 1 }), validarRequest], async (req, res, next) => {
    try {
        const result = await eliminarVoto({
            idresena: Number(req.params.id),
            idusuario: req.user.id
        });
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

export default router;
