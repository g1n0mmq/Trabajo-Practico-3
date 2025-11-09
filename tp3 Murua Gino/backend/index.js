import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { testConnection } from './database.js';
import rutasUsuarios from './usuarios.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', rutasUsuarios);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  testConnection();
});