
import { body, validationResult } from 'express-validator';

export const validarPelicula = [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('duracion_minutos').isInt().withMessage('La duración debe ser un número entero'),
    body('idcategoria').isInt().withMessage('La categoría es obligatoria'),
    body('idDirector').isInt().withMessage('El director es obligatorio'),
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
        next();
    }
];