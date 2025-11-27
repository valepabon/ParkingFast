import * as parqueaderoService from "../services/parqueaderoService.js";

/* ========================
   Ver lista principal
========================== */
export const verInventario = async (req, res) => {
  try {
    const parqueaderos = await parqueaderoService.obtenerTodos();
    res.render("parqueaderos", {
      parqueaderos,
      titulo: "Inventario de Parqueaderos"
    });
  } catch (err) {
    console.error("Error cargando inventario:", err.message);
    res.status(500).send("Error cargando inventario");
  }
};

/* ========================
   Mostrar formulario
========================== */
export const mostrarFormularioAgregar = (req, res) => {
  res.render("agregar_parqueadero", {
    parqueadero: null,
    modo: "crear",
    titulo: "Agregar Parqueadero"
  });
};

/* ========================
   Guardar nuevo
========================== */
export const guardarParqueadero = async (req, res) => {
  try {
    await parqueaderoService.crearParqueadero(req.body);
    res.json({ exito: true });
  } catch (err) {
    console.error("Error guardando parqueadero:", err.message);
    res.status(500).json({ exito: false });
  }
};

/* ========================
   Eliminar
========================== */
export const eliminarParqueadero = async (req, res) => {
  try {
    await parqueaderoService.eliminarParqueadero(req.params.id);
    res.json({ exito: true });
  } catch (err) {
    console.error("Error eliminando parqueadero:", err.message);
    res.status(500).json({ exito: false });
  }
};

/* ========================
   Editar
========================== */
export const mostrarFormularioEditar = async (req, res) => {
  try {
    const parqueadero = await parqueaderoService.obtenerPorId(req.params.id);
    if (!parqueadero) return res.status(404).send("No encontrado");

    res.render("agregar_parqueadero", {
      parqueadero,
      modo: "editar",
      titulo: "Editar Parqueadero"
    });
  } catch (err) {
    console.error("Error mostrando edición:", err.message);
    res.status(500).send("Error");
  }
};

export const editarParqueadero = async (req, res) => {
  try {
    await parqueaderoService.actualizarParqueadero(req.params.id, req.body);
    res.json({ exito: true });
  } catch (err) {
    console.error("Error editando parqueadero:", err.message);
    res.status(500).json({ exito: false });
  }
};
