import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import pool from './db.js';
import 'dotenv/config';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET; 

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const [rows] = await pool.query('SELECT id, email, rol FROM usuario WHERE id = ?', [jwt_payload.id]);

      if (rows.length > 0) {
        return done(null, rows[0]);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export const verificarJWT = passport.authenticate('jwt', { session: false });

export const esAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere ser administrador.' });
  }
};