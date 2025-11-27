import * as userService from '../services/userService.js';
import Conjunto from '../models/Conjunto.js';

export const mostrarLogin = (req, res) => {
  res.render('login', { titulo: 'Iniciar sesión' });
};

export const mostrarSignup = (req, res) => {
  res.render('signup', { titulo: 'Registro' });
};

export const crearUsuario = async (req, res) => {
  const { nombre, correo, password, confirmar, conjunto, direccion } = req.body;

  try {
    if (password !== confirmar) {
      return res.status(400).send('❌ Las contraseñas no coinciden');
    }

    const existe = await userService.getUserByEmail(correo);
    if (existe) return res.status(400).send('❌ Correo ya registrado');

    const conjuntoDB = await Conjunto.findOne({ nombre: conjunto || 'Los Tulipanes' });
    if (!conjuntoDB) return res.status(400).send('❌ Conjunto no encontrado');

    await userService.createUser({
      nombre,
      email: correo,
      password,
      rol: 'Residente',
      direccion,
      conjunto: conjuntoDB._id
    });

    console.log('✅ Usuario creado');
    res.redirect('/login');

  } catch (err) {
    console.error('❌ Error creando usuario:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

export const loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await userService.getUserByEmail(correo);

    if (!usuario) return res.status(401).send('❌ Usuario no encontrado');
    if (usuario.password !== password) return res.status(401).send('❌ Contraseña incorrecta');

    console.log('✅ Login exitoso');
    
    req.session.usuario = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        conjunto: usuario.conjunto
      };
      
    res.redirect('/inicio');

  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
};



