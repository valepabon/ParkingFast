
import express from "express";
import * as reservaAdminController from "../controllers/reservaAdminController.js";

const router = express.Router();

// Mostrar todas las reservas
router.get("/", reservaAdminController.listarReservas);

// Cambiar estado a "cerrada"
router.put("/cerrar/:id", reservaAdminController.cerrarReserva);

// Cambiar estado a "cancelada"
router.put("/cancelar/:id", reservaAdminController.cancelarReserva);

export default router;