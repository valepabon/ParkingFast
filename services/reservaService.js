// services/reservaService.js
import Reserva from "../models/Reserva.js";

/* ===========================================================
   OBTENER RESERVAS POR USUARIO
=========================================================== */
export const getReservasByUsuario = async (usuarioId) => {
  return await Reserva.find({ usuario: usuarioId }).populate("conjunto usuario");
};

/* ===========================================================
   OBTENER UNA RESERVA POR ID
=========================================================== */
export const getReservaById = async (id) => {
  return await Reserva.findById(id).populate("conjunto usuario");
};

/* ===========================================================
   CREAR RESERVA
=========================================================== */
export const createReserva = async (data) => {
  const reserva = new Reserva(data);
  return await reserva.save();
};

/* ===========================================================
   ACTUALIZAR RESERVA
=========================================================== */
export const updateReserva = async (id, data) => {
  return await Reserva.findByIdAndUpdate(id, { $set: data }, { new: true });
};

/* ===========================================================
   ELIMINAR RESERVA
=========================================================== */
export const deleteReserva = async (id) => {
  return await Reserva.findByIdAndDelete(id);
};

/* ===========================================================
   OBTENER TODAS
=========================================================== */
export const obtenerTodas = async () => {
  return await Reserva.find().populate("usuario conjunto");
};

/* ===========================================================
   CAMBIAR ESTADO
=========================================================== */
export const actualizarEstado = async (id, nuevoEstado) => {
  return await Reserva.findByIdAndUpdate(id, { estado: nuevoEstado });
};

/* ===========================================================
   VERIFICAR CONFLICTO DE HORARIO
=========================================================== */
export const existeConflictoHorario = async ({ fecha, horaInicio, horaFin, parqueadero, excluirId = null }) => {
  const query = {
    fecha,
    parqueadero,
    estado: { $in: ["activa", "pendiente"] },
    $or: [
      { horaInicio: { $lt: horaFin }, horaFin: { $gt: horaInicio } }
    ]
  };

  if (excluirId) query._id = { $ne: excluirId };

  const conflicto = await Reserva.findOne(query);
  return conflicto ? true : false;
};
