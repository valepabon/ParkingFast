import Usuario from '../models/Usuario.js';
import Conjunto from '../models/Conjunto.js';
import * as userService from '../services/userService.js';
import bcrypt from 'bcrypt';


/* =========================================================
   CREAR USUARIO (REGISTRO)
========================================================= */
export const crearUsuario = async (req, res) => {
  const { nombre, correo, password, confirmar, conjunto, direccion } = req.body;

  try {
    if (password !== confirmar) {
      return res.status(400).send('❌ Las contraseñas no coinciden');
    }

    const existe = await Usuario.findOne({ email: correo });
    if (existe) {
      return res.status(400).send('❌ Este correo ya está registrado');
    }

    const conjuntoDB = await Conjunto.findOne({ nombre: conjunto || 'Los Tulipanes' });
    if (!conjuntoDB) return res.status(400).send('❌ Conjunto no encontrado');

    // (Opcional) en un futuro reemplazar por password hasheada
    const nuevoUsuario = new Usuario({
      nombre,
      email: correo,
      password,
      rol: 'Residente',
      direccion,
      conjunto: conjuntoDB._id
    });

    await nuevoUsuario.save();

    console.log('✅ Usuario registrado:', nuevoUsuario.email);
    res.redirect('/login');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  }
};

/* =========================================================
   MOSTRAR USUARIOS
========================================================= */
export const renderUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('conjunto');
    res.render('usuarios', { usuarios });
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).send('Error al cargar usuarios');
  }
};

/* =========================================================
   LOGIN DE USUARIO
========================================================= */
export const loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email: correo });

    if (!usuario) return res.status(401).send('❌ Usuario no encontrado');
    if (usuario.password !== password) return res.status(401).send('❌ Contraseña incorrecta');

    console.log('✅ Login exitoso de:', usuario.email);

    // Guardamos sesión
    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      direccion: usuario.direccion,
      conjunto: usuario.conjunto
    };

    res.redirect('/inicio');

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).send('Error del servidor');
  }
};

/* =========================================================
   MOSTRAR PERFIL
========================================================= */
export const mostrarPerfil = async (req, res) => {
    const { usuario } = req.session;
    if (!usuario) return res.redirect('/login');
  
    try {
      const userDB = await userService.getUserById(usuario.id);
  
      res.render('perfil', {
        usuario: userDB,
        exito: req.query.exito === "1",
        error: req.query.error || null
      });
  
    } catch (err) {
      console.error("Error mostrando perfil:", err.message);
      res.status(500).send("Error cargando perfil");
    }
  };
  
  

/* =========================================================
   ACTUALIZAR PERFIL
========================================================= */
export const actualizarPerfil = async (req, res) => {
    const { usuario } = req.session;
    if (!usuario) return res.redirect('/login');
  
    let { nombre, email, direccion, conjunto, password } = req.body;
  
    try {
      const data = { nombre, email, direccion };
  
      // Si se cambia el conjunto
      if (conjunto && conjunto.trim() !== "") {
        const conjuntoDB = await Conjunto.findOne({ nombre: conjunto });
        if (!conjuntoDB) {
          return res.status(400).send("❌ Conjunto no encontrado");
        }
        data.conjunto = conjuntoDB._id;
      }
  
    // const hashed = await bcrypt.hash(password, 10);
    // data.password = hashed;

    if (password && password.trim() !== "") {
        data.password = password; 
        
      }
      


  
      // Guardar en BD
      await userService.updateUser(usuario.id, data);
  
      // Actualizar sesión con nuevos datos
      req.session.usuario = {
        ...req.session.usuario,
        nombre,
        email,
        direccion,
        conjunto: data.conjunto || usuario.conjunto
      };
  
      res.json({ exito: true });
;

  
    } catch (err) {
      console.error("❌ Error actualizando perfil:", err.message);
      res.status(500).send("Error al actualizar perfil");
    }
  };
  

  
  