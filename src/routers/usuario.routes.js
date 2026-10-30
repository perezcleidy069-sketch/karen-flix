import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { autenticar, soloAdministrador } from '../middlewares/auth.middleware.js';
import validarRequest from '../middlewares/validar-request.js';
import { crearUsuarioRegistro } from '../factory/usuario.factory.js';
import { usuarioObserver } from '../observer/usuario.observer.js';

const router = Router();
const passwordField = (field) => body(field)
    .isString().withMessage('La contraseña debe ser texto')
    .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres')
    .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
    .withMessage('La contraseña no puede superar los 72 bytes');

router.post(['/registro', '/register'], [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 60 }),
    body('apellido').optional({ values: 'falsy' }).trim().isLength({ max: 250 }),
    body('email').trim().isEmail().withMessage('El correo no es válido').normalizeEmail(),
    body('telefono').optional({ values: 'falsy' }).isString().isLength({ max: 20 }),
    body('avatar_url').optional({ values: 'falsy' }).isURL({ require_protocol: true }),
    passwordField('contrasena'),
    validarRequest
], async (req, res, next) => {
    try {
        const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [req.body.email]);
        if (existing.length) {
            return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
        }
        const passwordHash = await bcrypt.hash(req.body.contrasena, 12);
        const usuario = crearUsuarioRegistro({ ...req.body, contrasena: passwordHash });
        const [result] = await pool.execute(
            `INSERT INTO usuarios (nombre, apellido, email, telefono, contrasena, \`role\`, avatar_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario.nombre,
                usuario.apellido,
                usuario.email,
                usuario.telefono,
                usuario.contrasena,
                usuario.role,
                usuario.avatar_url
            ]
        );
        usuarioObserver.notificar({ tipo: 'usuario_registrado', usuarioId: result.insertId });
        return res.status(201).json({ id: result.insertId, mensaje: 'Cuenta creada correctamente' });
    } catch (error) {
        return next(error);
    }
});

router.post(['/login'], [
    body('email').trim().isEmail().withMessage('El correo no es válido').normalizeEmail(),
    body('contrasena').isString().notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ max: 72 }).withMessage('La contraseña no puede superar los 72 caracteres')
        .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
        .withMessage('La contraseña no puede superar los 72 bytes'),
    validarRequest
], async (req, res, next) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, nombre, apellido, email, contrasena, `role`, activo FROM usuarios WHERE email = ?',
            [req.body.email]
        );
        const user = users[0];
        if (!user || !user.activo) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const storedPassword = user.contrasena;
        const storedBytes = Buffer.from(storedPassword);
        const submittedBytes = Buffer.from(req.body.contrasena);
        let validPassword = storedPassword.startsWith('$2')
            ? await bcrypt.compare(req.body.contrasena, storedPassword)
            : storedBytes.length === submittedBytes.length
                && crypto.timingSafeEqual(storedBytes, submittedBytes);
        if (!validPassword) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }
        if (!storedPassword.startsWith('$2')) {
            const passwordHash = await bcrypt.hash(req.body.contrasena, 12);
            await pool.execute('UPDATE usuarios SET contrasena = ? WHERE id = ?', [passwordHash, user.id]);
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );
        return res.json({
            token,
            usuario: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/me', autenticar, (req, res) => res.json({ usuario: req.user }));

router.get('/', autenticar, soloAdministrador, async (req, res, next) => {
    try {
        const [users] = await pool.query(
            'SELECT id, nombre, apellido, email, telefono, `role`, activo, avatar_url, created_at FROM usuarios ORDER BY id'
        );
        return res.json(users);
    } catch (error) {
        return next(error);
    }
});

router.patch('/:id', autenticar, soloAdministrador, [
    body('role').optional().isIn(['usuario', 'administrador']),
    body('activo').optional().isBoolean().toBoolean(),
    validarRequest
], async (req, res, next) => {
    try {
        const fields = [];
        const values = [];
        if (req.body.role !== undefined) {
            fields.push('`role` = ?');
            values.push(req.body.role);
        }
        if (req.body.activo !== undefined) {
            fields.push('activo = ?');
            values.push(req.body.activo);
        }
        if (!fields.length) {
            return res.status(400).json({ error: 'Indica role o activo para actualizar' });
        }
        const [existing] = await pool.execute('SELECT id FROM usuarios WHERE id = ?', [req.params.id]);
        if (!existing.length) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        values.push(req.params.id);
        await pool.execute(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values);
        return res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        return next(error);
    }
});

router.delete('/:id', autenticar, soloAdministrador, async (req, res, next) => {
    try {
        if (Number(req.params.id) === req.user.id) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });
        }
        const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (!result.affectedRows) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        return next(error);
    }
});

export default router;
