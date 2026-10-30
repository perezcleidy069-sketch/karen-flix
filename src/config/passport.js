import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { pool } from './db.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET es obligatoria y debe tener al menos 32 caracteres');
}

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, nombre, apellido, email, `role`, activo FROM usuarios WHERE id = ?',
            [payload.sub]
        );
        const user = users[0];
        if (!user || !user.activo) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
