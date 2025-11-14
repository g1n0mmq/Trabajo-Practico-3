import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//validacion para el registro
export const validacionRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un formato de email válido'),
  body('contrasena')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

// login
export const validacionLogin = [
  body('email').isEmail().withMessage('Email no válido'),
  body('contrasena').notEmpty().withMessage('La contraseña es obligatoria'),
  handleValidationErrors
];
//logica para pacientes
export const validacionPaciente = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('DNI')
    .notEmpty().withMessage('El DNI es obligatorio')
    .isNumeric().withMessage('El DNI debe contener solo números')
    .isLength({ min: 7, max: 8 }).withMessage('El DNI debe tener entre 7 y 8 dígitos'),
  body('fecha_nacimiento')
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),
  handleValidationErrors
];

//lógica para validar los médicos
export const validacionMedico = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('especialidad').notEmpty().withMessage('La especialidad es obligatoria'),
  body('matricula_profesional').notEmpty().withMessage('La matrícula profesional es obligatoria'),
  handleValidationErrors
];

//lógica para validar los turnos
export const validacionTurno = [
  body('paciente_id').notEmpty().withMessage('El ID del paciente es obligatorio').isInt().withMessage('El ID del paciente debe ser un número'),
  body('medico_id').notEmpty().withMessage('El ID del médico es obligatorio').isInt().withMessage('El ID del médico debe ser un número'),
  body('fecha').isDate().withMessage('La fecha debe tener un formato válido'),
  body('hora')
    .notEmpty().withMessage('La hora es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage('La hora debe tener el formato HH:MM:SS'),
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['pendiente', 'confirmado', 'cancelado']).withMessage("El estado debe ser 'pendiente', 'confirmado' o 'cancelado'"),
  handleValidationErrors
];