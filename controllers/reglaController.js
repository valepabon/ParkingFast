import * as reglaService from "../services/reglaService.js";

/* ================================
   LISTAR REGLAS
================================ */
export const listarReglas = async (req, res) => {
  const reglas = await reglaService.obtenerReglas();
  res.render("reglas_conjunto", { reglas });
};

/* ================================
   FORM PARA CREAR
================================ */
export const mostrarFormularioAgregar = (req, res) => {
  res.render("regla_agregar", {
    tituloPagina: "Agregar Regla",
    modo: "crear",
    regla: null
  });
};

/* ================================
   FORM PARA EDITAR
================================ */
export const mostrarFormularioEditar = async (req, res) => {
  const regla = await reglaService.obtenerReglaPorId(req.params.id);

  if (!regla) return res.redirect("/administracion/reglas");

  res.render("regla_agregar", {
    tituloPagina: "Editar Regla",
    modo: "editar",
    regla
  });
};

/* ================================
   GUARDAR NUEVA
================================ */
export const guardarRegla = async (req, res) => {
  try {
    await reglaService.crearRegla(req.body);
    res.json({ exito: true });
  } catch (err) {
    res.json({ exito: false });
  }
};

/* ================================
   ACTUALIZAR
================================ */
export const actualizarRegla = async (req, res) => {
  try {
    await reglaService.actualizarRegla(req.params.id, req.body);
    res.json({ exito: true });
  } catch (err) {
    res.json({ exito: false });
  }
};

/* ================================
   ELIMINAR
================================ */
export const eliminarRegla = async (req, res) => {
  try {
    await reglaService.eliminarRegla(req.params.id);
    res.json({ exito: true });
  } catch (err) {
    res.json({ exito: false });
  }
};
