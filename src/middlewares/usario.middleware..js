
import { body, validationResult } from 'express-validator';

export const validarUsuario = [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
        next();
    }
];