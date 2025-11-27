import Reserva from "../models/Reserva.js";

export const getReservasByUsuario = async (usuarioId) => {
  return await Reserva.find({ usuario: usuarioId }).populate("conjunto usuario");
};

export const getReservaById = async (id) => {
  return await Reserva.findById(id).populate("conjunto usuario");
};

export const createReserva = async (data) => {
  const reserva = new Reserva(data);
  return await reserva.save();
};

export const updateReserva = async (id, data) => {
  return await Reserva.findByIdAndUpdate(id, { $set: data });
};

export const deleteReserva = async (id) => {
  return await Reserva.findByIdAndDelete(id);
};

export const obtenerTodas = async () => {
  return await Reserva.find().populate("usuario conjunto");
};

export const actualizarEstado = async (id, nuevoEstado) => {
  return await Reserva.findByIdAndUpdate(id, { estado: nuevoEstado });
};
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
  
  


  