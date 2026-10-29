import { body } from 'express-validator';

const UsuarioCrearValidaciones = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto')
        .trim(),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser un texto')
        .trim(),

    body('email')
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El email debe ser válido')
        .normalizeEmail(),

    body('telefono')
        .optional()
        .isMobilePhone().withMessage('El formato de teléfono no es válido'),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        }).withMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'),

    body('role')
        .notEmpty().withMessage('El rol es obligatorio')
        .isIn(['usuario', 'administrator']).withMessage('El rol debe ser estrictamente "usuario" o "administrator"')
];

export default UsuarioCrearValidaciones;