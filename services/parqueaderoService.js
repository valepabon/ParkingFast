import Parqueadero from "../models/Parqueadero.js";

export const obtenerTodos = () => Parqueadero.find();

export const crearParqueadero = (data) => {
  const parqueadero = new Parqueadero(data);
  return parqueadero.save();
};

export const eliminarParqueadero = (id) => Parqueadero.findByIdAndDelete(id);

export const obtenerPorId = (id) => Parqueadero.findById(id);

export const actualizarParqueadero = (id, datos) => {
  return Parqueadero.findByIdAndUpdate(id, datos, { new: true });
};
