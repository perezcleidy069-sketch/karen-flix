import { Router } from 'express';
import { pool } from '../config/db.js';
import { autenticar, autenticarOpcional, soloAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/inactivas', autenticarOpcional, async (req, res, next) => {
    try {
        const [rows] = await pool.execute(
            `SELECT p.idpelicula, p.titulo, p.anio_estreno, p.estado, p.created_at
             FROM peliculas p
             LEFT JOIN resenas r ON p.idpelicula = r.idpelicula
             WHERE (r.fechaResena IS NULL OR r.fechaResena < DATE_SUB(NOW(), INTERVAL 6 MONTH))
             AND p.estado = 'aprobada'
             GROUP BY p.idpelicula`
        );

        return res.json({
            success: true,
            total: rows.length,
            data: rows
        });
    } catch (error) {
        return next(error);
    }
});

export default router;