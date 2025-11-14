import { Router } from 'express';
import pool from './db.js';
import { validacionPaciente } from './validaciones.js';
import { verificarJWT, esAdmin } from './auth.js';

const router = Router();

// obtener pacientes
router.get('/', verificarJWT, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM paciente');
  res.json(rows);
});

// obtener paciente por id
router.get('/:id', verificarJWT, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM paciente WHERE id = ?', [req.params.id]);

  if (rows.length <= 0) {
    return res.status(404).json({ message: 'Paciente no encontrado' });
  }
  res.json(rows[0]);
});

// crear paciente nuevo
router.post('/', verificarJWT, esAdmin, validacionPaciente, async (req, res) => {
  const { nombre, apellido, DNI, fecha_nacimiento, obra_social } = req.body;

  const [resultado] = await pool.query(
    'INSERT INTO paciente (nombre, apellido, DNI, fecha_nacimiento, obra_social) VALUES (?, ?, ?, ?, ?)',
    [nombre, apellido, DNI, fecha_nacimiento, obra_social]
  );

  res.status(201).json({
    id: resultado.insertId,
    message: 'Paciente creado'
  });
});

// actualizar paciente
router.put('/:id', verificarJWT, esAdmin, validacionPaciente, async (req, res) => {
  const { nombre, apellido, DNI, fecha_nacimiento, obra_social } = req.body;

  const [resultado] = await pool.query(
    'UPDATE paciente SET nombre = ?, apellido = ?, DNI = ?, fecha_nacimiento = ?, obra_social = ? WHERE id = ?',
    [nombre, apellido, DNI, fecha_nacimiento, obra_social, req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: 'Paciente no encontrado' });
  }
  res.json({ message: 'Paciente actualizado' });
});

// eliminar paciente
router.delete('/:id', verificarJWT, esAdmin, async (req, res) => {
  const [resultado] = await pool.query('DELETE FROM paciente WHERE id = ?', [req.params.id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: 'Paciente no encontrado' });
  }
  res.json({ message: 'Paciente eliminado' });
});

export default router;