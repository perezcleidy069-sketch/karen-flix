import { body } from 'express-validator';

const CategoriaCrearValidaciones = [
    body('nombre')
        .exists().withMessage('El nombre es requerido')
        .notEmpty().withMessage('El nombre no puede estar vacío') 
        .isString().withMessage('El nombre debe ser un texto')
        .isLength({ min: 1, max: 150 }).withMessage('El nombre debe tener entre 1 y 150 caracteres')
        .trim(),

    body('imageUrl')
        .exists().withMessage('La imagen es requerida')
        .notEmpty().withMessage('La URL de la imagen no puede estar vacía')
        .isURL({ require_protocol: true }).withMessage('La imagen debe ser una URL válida')
        .matches(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i)
        .withMessage('La URL de la imagen debe tener un formato válido (jpg, jpeg, png, webp, gif, svg)')
];

export default CategoriaCrearValidaciones;