import * as comunidadService from '../services/comunidadService.js';
import Usuario from '../models/Usuario.js';

/* ================================
   VER TODAS LAS PUBLICACIONES
================================= */
export const verComunidad = async (req, res) => {
  try {
    const publicaciones = await comunidadService.obtenerTodas();
    res.render('comunidad_parqueadero', {
      publicaciones,
      titulo: 'Comunidad'
    });
  } catch (err) {
    console.error("Error al cargar comunidad:", err.message);
    res.status(500).send("Error al cargar comunidad");
  }
};


/* ================================
   FORMULARIO DE NUEVA PUBLICACIÓN
================================= */
export const mostrarFormulario = async (req, res) => {
  const { usuario } = req.session;

  if (!usuario) return res.redirect('/login');

  try {
    const usuarioDB = await Usuario.findById(usuario.id); // Asegura datos frescos
    res.render('comunidad_agregar', { usuario: usuarioDB , publicacion: null, modo: 'crear'});
  } catch (err) {
    console.error("Error obteniendo datos del usuario:", err.message);
    res.redirect('/comunidad');
  }
};


/* ================================
   GUARDAR NUEVA PUBLICACIÓN
================================= */
export const guardarPublicacion = async (req, res) => {
  const { usuario } = req.session;
  if (!usuario) return res.status(401).json({ exito: false, mensaje: 'No autenticado' });

  const {
    tipoParqueadero,
    tipoVehiculo,
    precio,
    fecha,
    telefono,
    ubicacion,
    descripcion
  } = req.body;

  try {
    await comunidadService.crearPublicacion({
      tipoParqueadero,
      tipoVehiculo,
      precio,
      fechaDisponible: fecha,
      propietario: usuario.id, // Asociación del usuario
      telefono,
      conjunto: ubicacion,
      descripcion
    });

    res.json({ exito: true });
  } catch (err) {
    console.error("Error publicando parqueadero:", err.message);
    res.status(500).json({ exito: false });
  }
};


/* ================================
   VER PUBLICACIONES DEL USUARIO
================================= */
export const misPublicaciones = async (req, res) => {
  const { usuario } = req.session;
  if (!usuario) return res.redirect('/login');

  try {
    const publicaciones = await comunidadService.obtenerPorUsuario(usuario.id);
    res.render('mis_publicaciones', {
      publicaciones,
      titulo: 'Comunidad'
    });
  } catch (err) {
    console.error("Error al obtener publicaciones del usuario:", err.message);
    res.status(500).send("Error al cargar tus publicaciones");
  }
};


/* ================================
   ELIMINAR UNA PUBLICACIÓN
================================= */
export const eliminarPublicacion = async (req, res) => {
  try {
    await comunidadService.eliminarPublicacion(req.params.id);
    res.json({ exito: true });
  } catch (err) {
    console.error("Error eliminando publicación:", err.message);
    res.status(500).json({ exito: false });
  }
};

// Mostrar formulario para editar publicación
export const mostrarFormularioEditar = async (req, res) => {
    const { usuario } = req.session;
    if (!usuario) return res.redirect('/login');
  
    try {
      const publicacion = await comunidadService.obtenerPorId(req.params.id);
      if (!publicacion) return res.status(404).send("No encontrado");
  
      res.render('comunidad_agregar', {
        usuario,
        publicacion,
        modo: 'editar'  // Indica que es modo edición
      });
    } catch (err) {
      console.error("Error cargando publicación para editar:", err.message);
      res.status(500).send("Error");
    }
  };

  export const editarPublicacion = async (req, res) => {
    const { usuario } = req.session;
    if (!usuario) return res.redirect('/login');
  
    try {
      await comunidadService.actualizarPublicacion(req.params.id, req.body);
      res.json({ exito: true });
    } catch (err) {
      console.error("Error editando publicación:", err.message);
      res.status(500).json({ exito: false });
    }
  };
  
  