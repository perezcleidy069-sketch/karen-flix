import { body } from 'express-validator';

const ResenaCrearValidaciones = [
    body('idpelicula')
        .exists().withMessage('El ID de la película es requerido')
        .notEmpty().withMessage('El ID de la película no puede estar vacío')
        .isInt({ min: 1 }).withMessage('El ID de la película debe ser un número entero válido'),

    body('idusuario')
        .exists().withMessage('El ID del usuario es requerido')
        .notEmpty().withMessage('El ID del usuario no puede estar vacío')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero válido'),

    body('comentarios')
        .exists().withMessage('Los comentarios son requeridos')
        .notEmpty().withMessage('Los comentarios no pueden estar vacíos')
        .isString().withMessage('Los comentarios deben ser un texto')
        .trim(),

    body('fechaReseña')
        .optional()
        .isISO8601().withMessage('La fecha de la reseña debe tener un formato válido (YYYY-MM-DD)'),

    body('punteo')
        .exists().withMessage('El punteo es requerido')
        .notEmpty().withMessage('El punteo no puede estar vacío')
        .isInt({ min: 1, max: 10 }).withMessage('El punteo debe ser un número entero entre 1 y 10')
];

export default ResenaCrearValidaciones;