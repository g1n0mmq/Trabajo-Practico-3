import { Router } from 'express';
import pool from '../db.js';
import { validacionTurno } from '../validaciones.js';

const router = Router();


// Obtener todos los turnos
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM turno');
  res.json(rows);
});

// Obtener un turno por ID
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM turno WHERE id = ?', [req.params.id]);

  if (rows.length <= 0) {
    return res.status(404).json({ message: 'Turno no encontrado' });
  }
  res.json(rows[0]);
});

// Crear un nuevo turno
router.post('/', validacionTurno, async (req, res) => {
  const { paciente_id, medico_id, fecha, hora, estado, observaciones } = req.body;

  const [resultado] = await pool.query(
    'INSERT INTO turno (paciente_id, medico_id, fecha, hora, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
    [paciente_id, medico_id, fecha, hora, estado, observaciones]
  );

  res.status(201).json({
    id: resultado.insertId,
    message: 'Turno creado'
  });
});

// Actualizar un turno
router.put('/:id', validacionTurno, async (req, res) => {
  const { paciente_id, medico_id, fecha, hora, estado, observaciones } = req.body;

  const [resultado] = await pool.query(
    'UPDATE turno SET paciente_id = ?, medico_id = ?, fecha = ?, hora = ?, estado = ?, observaciones = ? WHERE id = ?',
    [paciente_id, medico_id, fecha, hora, estado, observaciones, req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: 'Turno no encontrado' });
  }
  res.json({ message: 'Turno actualizado' });
});

// Eliminar un turno
router.delete('/:id', async (req, res) => {
  const [resultado] = await pool.query('DELETE FROM turno WHERE id = ?', [req.params.id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: 'Turno no encontrado' });
  }
  res.json({ message: 'Turno eliminado' });
});

export default router;