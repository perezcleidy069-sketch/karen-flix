import { Router } from 'express';
import { body, param } from 'express-validator';
import { pool } from '../config/db.js';
import { autenticar, soloAdministrador } from '../middlewares/auth.middleware.js';
import validarRequest from '../middlewares/validar-request.js';

export default function crearRutasCatalogo({ tabla, camposImagen, conApellido = true, nombreUnico = false }) {
    const router = Router();
    const columnas = `id, nombre, ${conApellido ? 'apellido, ' : ''}${camposImagen}`;
    const orden = conApellido ? 'nombre, apellido' : 'nombre';

    async function validarNombreUnico(req, res, next) {
        if (!nombreUnico) {
            return next();
        }
        try {
            const values = [req.body.nombre];
            const excludeCurrent = req.params.id ? ' AND id <> ?' : '';
            if (req.params.id) {
                values.push(req.params.id);
            }
            const [matches] = await pool.execute(
                `SELECT id FROM ${tabla} WHERE nombre = ?${excludeCurrent} LIMIT 1`,
                values
            );
            if (matches.length) {
                return res.status(409).json({ error: 'Ya existe un registro con ese nombre' });
            }
            return next();
        } catch (error) {
            return next(error);
        }
    }

    router.get('/', async (req, res, next) => {
        try {
            const [rows] = await pool.query(`SELECT ${columnas} FROM ${tabla} ORDER BY ${orden}`);
            return res.json(rows);
        } catch (error) {
            return next(error);
        }
    });

    router.get('/:id', [param('id').isInt({ min: 1 }), validarRequest], async (req, res, next) => {
        try {
            const [rows] = await pool.execute(`SELECT ${columnas} FROM ${tabla} WHERE id = ?`, [req.params.id]);
            if (!rows.length) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            return res.json(rows[0]);
        } catch (error) {
            return next(error);
        }
    });

    router.post('/', autenticar, soloAdministrador, [
        body('nombre').trim().notEmpty().isLength({ max: 60 }),
        body('apellido').optional({ values: 'falsy' }).trim().isLength({ max: 250 }),
        body(camposImagen).optional({ values: 'falsy' }).isURL({ require_protocol: true }),
        validarRequest
    ], validarNombreUnico, async (req, res, next) => {
        try {
            const imagen = req.body[camposImagen] || null;
            const fields = conApellido ? 'nombre, apellido' : 'nombre';
            const values = conApellido ? [req.body.nombre, req.body.apellido || null, imagen] : [req.body.nombre, imagen];
            const placeholders = conApellido ? '?, ?, ?' : '?, ?';
            const [result] = await pool.execute(
                `INSERT INTO ${tabla} (${fields}, ${camposImagen}) VALUES (${placeholders})`,
                values
            );
            return res.status(201).json({ id: result.insertId, mensaje: 'Registro creado correctamente' });
        } catch (error) {
            return next(error);
        }
    });

    router.put('/:id', autenticar, soloAdministrador, [
        param('id').isInt({ min: 1 }),
        body('nombre').trim().notEmpty().isLength({ max: 60 }),
        body('apellido').optional({ values: 'falsy' }).trim().isLength({ max: 250 }),
        body(camposImagen).optional({ values: 'falsy' }).isURL({ require_protocol: true }),
        validarRequest
    ], validarNombreUnico, async (req, res, next) => {
        try {
            const [existing] = await pool.execute(`SELECT id FROM ${tabla} WHERE id = ?`, [req.params.id]);
            if (!existing.length) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            const imagen = req.body[camposImagen] || null;
            const fields = conApellido ? 'nombre = ?, apellido = ?, ' : 'nombre = ?, ';
            const values = conApellido
                ? [req.body.nombre, req.body.apellido || null, imagen, req.params.id]
                : [req.body.nombre, imagen, req.params.id];
            await pool.execute(
                `UPDATE ${tabla} SET ${fields}${camposImagen} = ? WHERE id = ?`,
                values
            );
            return res.json({ mensaje: 'Registro actualizado correctamente' });
        } catch (error) {
            return next(error);
        }
    });

    router.delete('/:id', autenticar, soloAdministrador, [
        param('id').isInt({ min: 1 }),
        validarRequest
    ], async (req, res, next) => {
        try {
            const [result] = await pool.execute(`DELETE FROM ${tabla} WHERE id = ?`, [req.params.id]);
            if (!result.affectedRows) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            return res.json({ mensaje: 'Registro eliminado correctamente' });
        } catch (error) {
            return next(error);
        }
    });

    return router;
}
