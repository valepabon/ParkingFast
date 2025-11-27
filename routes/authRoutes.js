import { Router } from 'express';
import {
  mostrarLogin,
  mostrarSignup,
  crearUsuario,
  loginUsuario
} from '../controllers/authController.js';

import Usuario from '../models/Usuario.js'; // <-- Import necesario

const router = Router();

// Mostrar formularios
router.get('/login', mostrarLogin);
router.get('/signup', mostrarSignup);

// ⚠️ Ruta temporal a /inicio (hasta que implementes sesiones)
router.get('/inicio', async (req, res) => {
  const usuario = await Usuario.findOne(); // ⚠️ Solo el primero de la DB
  res.render('inicio', { titulo: 'Inicio', usuario });
});

// Procesar formularios
router.post('/signup', crearUsuario);
router.post('/login', loginUsuario);

export default router;
