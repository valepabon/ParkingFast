import express from "express";
import * as parqueaderoController from "../controllers/parqueaderoController.js";

const router = express.Router();

// Inventario principal
router.get("/", parqueaderoController.verInventario);

// Formulario agregar parqueadero
router.get("/agregar", parqueaderoController.mostrarFormularioAgregar);
router.post("/agregar", parqueaderoController.guardarParqueadero);

// Formulario editar parqueadero
router.get("/editar/:id", parqueaderoController.mostrarFormularioEditar);
router.post("/editar/:id", parqueaderoController.editarParqueadero);

// Eliminar parqueadero
router.delete("/eliminar/:id", parqueaderoController.eliminarParqueadero);

export default router;


