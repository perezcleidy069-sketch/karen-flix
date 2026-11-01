import { body } from 'express-validator';

const UsuarioCrearValidaciones = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto')
        .trim(),

    body('apellido')
        .optional({ values: 'falsy' })
        .isString().withMessage('El apellido debe ser un texto')
        .trim()
        .isLength({ max: 250 }),

    body('email')
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El email debe ser válido')
        .normalizeEmail(),

    body('telefono')
        .optional()
        .isMobilePhone().withMessage('El formato de teléfono no es válido'),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres')
];

export default UsuarioCrearValidaciones;