import * as reservaService from "../services/reservaService.js";
import { generarCodigoReserva } from "../util/generarCodigoReserva.js";

/* ===========================================================
   MOSTRAR RESERVAS DEL USUARIO
=========================================================== */
export const mostrarReservas = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    if (!usuario) return res.redirect("/login");

    const reservas = await reservaService.getReservasByUsuario(usuario.id);

    res.render("reservas", {
      titulo: "Mis Reservas",
      usuario,
      reservas
    });

  } catch (err) {
    console.error("Error mostrando reservas:", err.message);
    res.status(500).send("Error cargando reservas");
  }
};

/* ===========================================================
   CREAR RESERVA
=========================================================== */
export const crearReserva = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    if (!usuario) {
      return res.status(401).json({ exito: false, mensaje: "No autenticado" });
    }

    const { fecha, horaInicio, horaFin, placa, parqueadero } = req.body;

    // ⛔ VALIDAR CONFLICTOS
    const conflicto = await reservaService.existeConflictoHorario({
      fecha,
      horaInicio,
      horaFin,
      parqueadero
    });

    if (conflicto) {
      return res.status(409).json({
        exito: false,
        mensaje: `Ese parqueadero ya está reservado en ese horario.`
      });
    }

    // Crear reserva
    const nuevaReserva = await reservaService.createReserva({
      codigo: generarCodigoReserva(),
      usuario: usuario.id,
      conjunto: usuario.conjunto,
      fecha,
      horaInicio,
      horaFin,
      placa,
      parqueadero,
      estado: "activa"
    });

    // Obtener datos completos con populate
    const reservaConDatos = await reservaService.getReservaById(nuevaReserva._id);

    res.status(200).json({
      exito: true,
      reserva: {
        _id: reservaConDatos._id,
        conjunto: { nombre: reservaConDatos.conjunto.nombre },
        fecha: reservaConDatos.fecha,
        horaInicio: reservaConDatos.horaInicio,
        horaFin: reservaConDatos.horaFin,
        placa: reservaConDatos.placa,
        parqueadero: reservaConDatos.parqueadero,
        estado: reservaConDatos.estado
      }
    });

  } catch (error) {
    console.error("Error creando reserva:", error);
    res.status(500).json({ exito: false, mensaje: "Error interno" });
  }
};

/* ===========================================================
   EDITAR (ACTUALIZAR) RESERVA
=========================================================== */
export const actualizarReserva = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    if (!usuario) {
      return res.status(401).json({ exito: false, mensaje: "No autenticado" });
    }

    const id = req.params.id;
    const { fecha, horaInicio, horaFin, placa, parqueadero } = req.body;

    // ⛔ VALIDAR CONFLICTO EXCLUYENDO ESTA MISMA RESERVA
    const conflicto = await reservaService.existeConflictoHorario({
      fecha,
      horaInicio,
      horaFin,
      parqueadero,
      excluirId: id
    });

    if (conflicto) {
      return res.status(409).json({
        exito: false,
        mensaje: `Horario no disponible para ese parqueadero.`
      });
    }

    // Actualizar
    await reservaService.updateReserva(id, {
      fecha,
      horaInicio,
      horaFin,
      placa,
      parqueadero
    });

    res.json({ exito: true, mensaje: "Reserva actualizada correctamente" });

  } catch (err) {
    console.error("Error actualizando reserva:", err.message);
    res.status(500).json({ exito: false, mensaje: "Error interno" });
  }
};

/* ===========================================================
   ELIMINAR RESERVA
=========================================================== */
export const eliminarReserva = async (req, res) => {
  try {
    const id = req.params.id;

    await reservaService.deleteReserva(id);

    res.json({ exito: true, mensaje: "Reserva eliminada con éxito" });

  } catch (err) {
    console.error("Error eliminando reserva:", err.message);
    res.status(500).json({ exito: false, mensaje: "Error eliminando reserva" });
  }
};

