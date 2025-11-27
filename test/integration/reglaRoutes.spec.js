import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import reglaRoutes from '../../routes/reglaRoutes.js';
import { connectDatabase } from '../../config/database.js';
import Usuario from '../../models/Usuario.js';
import Conjunto from '../../models/Conjunto.js';
import Regla from '../../models/Regla.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../');

describe('reglaRoutes (integración)', function () {
  this.timeout(30000);
  let mongod;
  let app;
  let usuario;
  let reglaId;

  before(async () => {
    // Iniciar MongoDB en memoria
    mongod = await MongoMemoryServer.create();
    const uri = new URL(mongod.getUri());

    process.env.MONGO_HOST = uri.hostname;
    process.env.MONGO_PORT = uri.port;
    process.env.MONGO_DB = (uri.pathname && uri.pathname.slice(1)) || 'testdb';

    await connectDatabase();

    const conjunto = await Conjunto.findOneAndUpdate(
      { nombre: 'Los Tulipanes' },
      { nombre: 'Los Tulipanes', ciudad: 'Bogotá', direccion: 'Cra 1 # 23-45' },
      { upsert: true, new: true }
    );

    usuario = await Usuario.create({
      nombre: 'AdminReglas',
      email: 'admin123@correo.com',
      password: '123456',
      direccion: 'Admin',
      rol: 'Administrador',
      conjunto: conjunto._id
    });

    // App de prueba
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));

    // Simular login
    app.use((req, res, next) => {
      req.session.usuario = {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        conjunto: usuario.conjunto
      };
      next();
    });

    app.set('view engine', 'ejs');
    app.set('views', path.join(PROJECT_ROOT, 'views'));

    // Rutas
    app.use('/administracion/reglas', reglaRoutes);
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  // === Test 1: Crear ===
  it('POST /guardar → debe crear una nueva regla', async () => {
    const res = await request(app)
      .post('/administracion/reglas/guardar')
      .send({
        conjunto: 'Los Tulipanes',
        titulo: 'Horarios Permitidos',
        descripcion: 'Visitas solo de 8am a 8pm'
      });

    if (res.status !== 200) throw new Error('❌ Status no esperado');
    if (!res.body.exito) throw new Error('❌ No se creó la regla');

    const regla = await Regla.findOne({ titulo: 'Horarios Permitidos' });
    if (!regla) throw new Error('❌ Regla no guardada en BD');

    reglaId = regla._id;
  });

  // === Test 2: Ver listado ===
  it('GET / → debe mostrar la lista de reglas', async () => {
    const res = await request(app).get('/administracion/reglas');
    if (res.status !== 200) throw new Error('❌ No cargó la vista');

    if (!res.text.includes('Horarios Permitidos')) {
      throw new Error('❌ La regla no aparece en la vista');
    }
  });

  // === Test 3: Editar regla existente ===
  it('POST /guardar (con ID) → debe editar una regla existente', async () => {
    const res = await request(app)
      .post('/administracion/reglas/guardar')
      .send({
        id: reglaId,
        conjunto: 'Los Tulipanes',
        titulo: 'Horarios Actualizados',
        descripcion: 'Nuevos horarios de visita: 7am - 9pm'
      });

    if (!res.body.exito) throw new Error('❌ No se actualizó la regla');

    const actualizada = await Regla.findById(reglaId);
    if (actualizada.titulo !== 'Horarios Actualizados') {
      throw new Error('❌ La regla no se actualizó correctamente');
    }
  });

  // === Test 4: Eliminar ===
  it('DELETE /eliminar/:id → debe eliminar una regla', async () => {
    const res = await request(app)
      .delete(`/administracion/reglas/eliminar/${reglaId}`);

    if (!res.body.exito) throw new Error('❌ No se eliminó la regla');

    const borrada = await Regla.findById(reglaId);
    if (borrada) throw new Error('❌ La regla aún existe en BD');
  });
});
