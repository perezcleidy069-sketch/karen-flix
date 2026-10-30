import { body } from 'express-validator';

const ResenaCrearValidaciones = [
    body('idpelicula').isInt({ min: 1 }).withMessage('El ID de la película no es válido'),
    body('titulo').trim().notEmpty().isLength({ max: 150 }),
    body('comentarios').trim().notEmpty().isLength({ max: 5000 }),
    body('puntaje').isInt({ min: 1, max: 10 }).withMessage('La calificación debe ser un entero entre 1 y 10').toInt()
];

export default ResenaCrearValidaciones;
