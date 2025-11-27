import { Router } from 'express';
import { 
  crearUsuario, 
  renderUsuarios, 
  mostrarPerfil, 
  actualizarPerfil 
} from '../controllers/usuarioController.js';

const router = Router();

// Mostrar todos los usuarios
router.get('/', renderUsuarios);

// Crear nuevo usuario
router.post('/', crearUsuario);

// Mostrar perfil del usuario
router.get('/perfil', mostrarPerfil);

// Actualizar perfil
router.post('/perfil', actualizarPerfil);

export default router;


