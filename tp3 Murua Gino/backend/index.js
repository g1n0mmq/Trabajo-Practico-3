import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import passport from 'passport';
import './auth.js';
import { testConnection } from './db.js';
import rutasUsuarios from './usuarios.js'; 
import rutasPacientes from './pacientes.js';
import rutasMedicos from './medicos.js';
import rutasTurnos from './turnos.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/api/auth', rutasUsuarios);
app.use('/api/pacientes', rutasPacientes); 
app.use('/api/medicos', rutasMedicos);
app.use('/api/turnos', rutasTurnos);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  testConnection();
});