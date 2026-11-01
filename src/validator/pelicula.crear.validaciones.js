import { body } from 'express-validator';

export const PeliculaCrearValidaciones = [
    body('titulo').trim().notEmpty().isLength({ max: 150 }),
    body('sinopsis').isString().trim().notEmpty(),
    body('anio_estreno').isInt({ min: 1888, max: new Date().getFullYear() + 5 }).toInt(),
    body('duracion_minutos').optional({ values: 'falsy' }).isInt({ min: 1 }).toInt(),
    body('idcategoria').isInt({ min: 1 }).toInt(),
    body('iddirector').optional({ values: 'falsy' }).isInt({ min: 1 }).toInt(),
    body('imagen').optional({ values: 'falsy' }).isURL({ require_protocol: true }),
    body('trailer_url').optional({ values: 'falsy' }).isURL({ require_protocol: true }),
    body('tipo').optional().isIn(['pelicula', 'serie'])
];
