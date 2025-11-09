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
  body('DNI').notEmpty().withMessage('El DNI es obligatorio'),
  body('fecha_nacimiento')
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),
  handleValidationErrors
];