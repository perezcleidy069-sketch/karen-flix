import { body } from 'express-validator';

export const DirectorCrearValidaciones = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser texto')
        .trim(),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser texto')
        .trim(),

    body('imagen_url')
        .notEmpty().withMessage('La imagen es obligatoria')
        .isURL({ require_protocol: true }).withMessage('Debe ser una URL válida (ej: https://dominio.com)')
        .matches(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i)
        .withMessage('La URL debe apuntar a una imagen válida (jpg, jpeg, png, webp, gif o svg)')
];