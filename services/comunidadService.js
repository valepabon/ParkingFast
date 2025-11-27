import Comunidad from '../models/Comunidad.js';

export const obtenerTodas = async () => {
  return await Comunidad.find().populate('propietario');
};

export const obtenerPorUsuario = async (usuarioId) => {
  return await Comunidad.find({ propietario: usuarioId });
};

export const crearPublicacion = async (datos) => {
  const publicacion = new Comunidad(datos);
  await publicacion.save();
};

export const eliminarPublicacion = async (id) => {
  await Comunidad.findByIdAndDelete(id);
};

export const obtenerPorId = async (id) => {
    return Comunidad.findById(id);
  };
  
  export const actualizarPublicacion = async (id, datos) => {
    return Comunidad.findByIdAndUpdate(id, {
      tipoParqueadero: datos.tipoParqueadero,
      tipoVehiculo: datos.tipoVehiculo,
      precio: datos.precio,
      fechaDisponible: datos.fecha,
      telefono: datos.telefono,
      conjunto: datos.ubicacion,
      descripcion: datos.descripcion
    }, { new: true });
  };
  
