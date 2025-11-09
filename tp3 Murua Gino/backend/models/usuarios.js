import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { validacionRegistro, validacionLogin } from '../validaciones.js'; 

const router = Router();


const crearUsuario = async (nombre, email, contrasenaHash) => {
  const [resultado] = await pool.query(
    "INSERT INTO usuario (nombre, email, contraseña, rol) VALUES (?, ?, ?, 'usuario')",
    [nombre, email, contrasenaHash]
  );
  return resultado.insertId;
};


const obtenerUsuarioPorEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
  return rows[0];
};


const register = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    const usuarioExistente = await obtenerUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);
    const nuevoUsuarioId = await crearUsuario(nombre, email, contrasenaHash);
    res.status(201).json({ message: 'Usuario registrado exitosamente', usuarioId: nuevoUsuarioId });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas (email)' });
    }
    const esCorrecta = await bcrypt.compare(contrasena, usuario.contraseña);
    if (!esCorrecta) {
      return res.status(401).json({ message: 'Credenciales inválidas (contraseña)' });
    }
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );
    res.status(200).json({ message: 'Login exitoso', token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};



router.post('/register', validacionRegistro, register);
router.post('/login', validacionLogin, login);
export default router;