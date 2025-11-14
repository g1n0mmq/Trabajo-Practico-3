import { Router } from 'express';
import pool from '../db.js';
import { validacionMedico } from '../validaciones.js';
import { verificarJWT, esAdmin } from '../auth.js';

const router = Router();

// Obtener todos los médicos
router.get('/', verificarJWT, async (req, res) => {try { 
    const { nombre, apellido, especialidad, matricula_profesional } = req.body;
    //Modificamos para que no hayan duplicados
    const id = await MedicoModel.crear(nombre, apellido, especialidad, matricula_profesional);
    
    res.status(201).json({ id: id, message: 'Medico creado' });

  } catch (e) { 
    
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Esa matrícula profesional ya está registrada.' });
    } 
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener un médico por ID
router.get('/:id', verificarJWT, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM medico WHERE id = ?', [req.params.id]);

  if (rows.length <= 0) {
    return res.status(404).json({ message: 'Médico no encontrado' });
  }
  res.json(rows[0]);
});

// Crear un nuevo médico
router.post('/', verificarJWT, esAdmin, validacionMedico, async (req, res) => {
  const { nombre, apellido, especialidad, matricula_profesional } = req.body;

  const [resultado] = await pool.query(
    'INSERT INTO medico (nombre, apellido, especialidad, matricula_profesional) VALUES (?, ?, ?, ?)',
    [nombre, apellido, especialidad, matricula_profesional]
  );

  res.status(201).json({
    id: resultado.insertId,
    message: 'Médico creado'
  });
});

// Actualizar un médico
router.put('/:id', verificarJWT, esAdmin, validacionMedico, async (req, res) => {
  const { nombre, apellido, especialidad, matricula_profesional } = req.body;

  const [resultado] = await pool.query(
    'UPDATE medico SET nombre = ?, apellido = ?, especialidad = ?, matricula_profesional = ? WHERE id = ?',
    [nombre, apellido, especialidad, matricula_profesional, req.params.id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: 'Médico no encontrado' });
  }
  res.json({ message: 'Médico actualizado' });
});

// Eliminar un médico
router.delete('/:id', verificarJWT, esAdmin, async (req, res) => {
  const [resultado] = await pool.query('DELETE FROM medico WHERE id = ?', [req.params.id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: 'Médico no encontrado' });
  }
  res.json({ message: 'Médico eliminado' });
});

export default router;