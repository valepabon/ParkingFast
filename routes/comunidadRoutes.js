import express from 'express';
import * as comunidadController from '../controllers/comunidadController.js';

const router = express.Router();

router.get('/', comunidadController.verComunidad);
router.get('/agregar', comunidadController.mostrarFormulario);
router.post('/agregar', comunidadController.guardarPublicacion);
router.get('/mis-publicaciones', comunidadController.misPublicaciones);
router.delete('/eliminar/:id', comunidadController.eliminarPublicacion);
router.get('/editar/:id', comunidadController.mostrarFormularioEditar);
router.post('/editar/:id', comunidadController.editarPublicacion);

export default router;
