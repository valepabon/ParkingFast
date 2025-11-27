import Regla from "../models/Regla.js";

export const obtenerReglas = () => Regla.find();
export const obtenerReglaPorId = (id) => Regla.findById(id);
export const crearRegla = (data) => Regla.create(data);
export const actualizarRegla = (id, data) =>
  Regla.findByIdAndUpdate(id, data, { new: true });
export const eliminarRegla = (id) => Regla.findByIdAndDelete(id);

