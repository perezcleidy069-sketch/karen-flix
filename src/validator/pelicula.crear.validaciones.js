import { body } from 'express-validator';

export const PeliculaCrearValidaciones = [
    body('titulo')
        .exists().withMessage('El título es requerido')
        .notEmpty().withMessage('El título es obligatorio')
        .isString().withMessage('El título debe ser texto')
        .isLength({ min: 1, max: 150 }).withMessage('El título debe tener entre 1 y 150 caracteres.')
        .trim(),

    body('sinopsis')
        .exists().withMessage('La sinopsis es requerida')
        .notEmpty().withMessage('La sinopsis no debe estar vacía')
        .isString().withMessage('La sinopsis debe ser texto')
        .trim(),

    body('anio_estreno') 
        .exists().withMessage('El año de estreno es requerido')
        .notEmpty().withMessage('El año de estreno no debe estar vacío')
        .isInt({ min: 1888, max: new Date().getFullYear() + 5 }).withMessage('El año de estreno debe ser un número válido')
        .toInt(),

    body('duracion_minutos') 
        .exists().withMessage('La duración en minutos es requerida')
        .notEmpty().withMessage('La duración no debe estar vacía')
        .isInt({ min: 1 }).withMessage('La duración debe ser un número entero mayor a 0')
        .toInt(),

    body('idcategoria')
        .exists().withMessage('La categoría es requerida')
        .notEmpty().withMessage('El ID de la categoría es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de categoría debe ser numérico'),

    body('idDirector')
        .exists().withMessage('El director es requerido')
        .notEmpty().withMessage('El ID del director es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de director debe ser numérico'),

    body('imagen')
        .exists().withMessage('La imagen es requerida')
        .notEmpty().withMessage('La URL de la imagen es obligatoria')
        .isURL({ require_protocol: true }).withMessage('La imagen debe ser una URL válida')
        .matches(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i)
        .withMessage('La URL de la imagen debe tener un formato válido (jpg, jpeg, png, webp, gif, svg)'),

    body('trailer_url')
        .optional().isURL({ require_protocol: true }).withMessage('El tráiler debe ser una URL válida')
];