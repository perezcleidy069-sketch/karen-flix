import { body, validationResult } from 'express-validator';

export const validarCategoria = [
    body('nombre').notEmpty().withMessage('El nombre de la categoría es obligatorio'),
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
        next();
    }
];