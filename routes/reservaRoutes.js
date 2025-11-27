import { Router } from "express";
import {
  mostrarReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva
} from "../controllers/reservaController.js";

const router = Router();

// Página principal de reservas
router.get("/", mostrarReservas);

// Crear nueva reserva
router.post("/crear", crearReserva);

// Actualizar reserva
router.put("/editar/:id", actualizarReserva);

// Eliminar reserva
router.post("/eliminar/:id", eliminarReserva);

export default router;

