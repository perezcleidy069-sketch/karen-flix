import passport from '../config/passport.js';

export const autenticar = (req, res, next) => passport.authenticate(
    'jwt',
    { session: false },
    (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.status(401).json({ error: 'Debes iniciar sesión para realizar esta acción' });
        }
        req.user = user;
        return next();
    }
)(req, res, next);

export function autenticarOpcional(req, res, next) {
    passport.authenticate('jwt', { session: false }, (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user && req.headers.authorization) {
            return res.status(401).json({ error: 'Token no válido o expirado' });
        }
        req.user = user || null;
        return next();
    })(req, res, next);
}

export function permitirRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
        }
        return next();
    };
}

export const soloAdministrador = permitirRoles('administrador');
