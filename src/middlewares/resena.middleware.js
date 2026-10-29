import { body, validationResult } from 'express-validator';

export const validarResena = [
    body('idpelicula').isInt().withMessage('Debe asociarse a una película válida'),
    body('iduasuario').isInt().withMessage('Debe asociarse a un usuario válido'),
    body('comentarios').notEmpty().withMessage('El comentario no puede ir vacío'),
    body('puntuo').isDecimal().withMessage('La puntuación debe ser un número válido'),
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
        next();
    }
];