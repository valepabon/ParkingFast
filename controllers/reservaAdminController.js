import * as reservaService from "../services/reservaService.js";

/* ========================
   Mostrar todas las reservas
========================== */
export const listarReservas = async (req, res) => {
  try {
    const reservas = await reservaService.obtenerTodas();
    res.render("gestion_reservas", { reservas, titulo: "Gestión de Reservas" });
  } catch (error) {
    console.error("Error cargando reservas:", error.message);
    res.status(500).send("Error cargando reservas");
  }
};

/* ========================
   Cambiar estado a "cerrada"
========================== */
export const cerrarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    await reservaService.actualizarEstado(id, "cerrada");
    res.json({ exito: true });
  } catch (error) {
    console.error("Error cerrando reserva:", error.message);
    res.status(500).json({ exito: false });
  }
};

/* ========================
   Cambiar estado a "cancelada"
========================== */
export const cancelarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    await reservaService.actualizarEstado(id, "cancelada");
    res.json({ exito: true });
  } catch (error) {
    console.error("Error cancelando reserva:", error.message);
    res.status(500).json({ exito: false });
  }
};
