import express from 'express';
import {
  listarReglas,
  mostrarFormularioAgregar,
  mostrarFormularioEditar,
  guardarRegla,
  actualizarRegla,
  eliminarRegla
} from '../controllers/reglaController.js';

const router = express.Router();

router.get('/', listarReglas);
router.get('/agregar', mostrarFormularioAgregar);
router.get('/editar/:id', mostrarFormularioEditar);

router.post('/guardar', guardarRegla);
router.put('/actualizar/:id', actualizarRegla);

router.delete('/eliminar/:id', eliminarRegla);

export default router;

