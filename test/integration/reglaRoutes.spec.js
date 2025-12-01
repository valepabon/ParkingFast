import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { expect } from 'chai';

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
    mongod = await MongoMemoryServer.create();
    const uri = new URL(mongod.getUri());

    process.env.MONGO_HOST = uri.hostname;
    process.env.MONGO_PORT = uri.port;
    process.env.MONGO_DB = (uri.pathname && uri.pathname.slice(1)) || 'testdb';

    await connectDatabase();

    await Conjunto.findOneAndUpdate(
      { nombre: 'Los Tulipanes' },
      { nombre: 'Los Tulipanes', ciudad: 'Bogotá', direccion: 'Cra 1 # 23-45' },
      { upsert: true, new: true }
    );

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));

    app.set('view engine', 'ejs');
    app.set('views', path.join(PROJECT_ROOT, 'views'));

    app.use('/administracion/reglas', reglaRoutes);
  });

  beforeEach(async () => {
    // Limpiar usuarios y reglas antes de cada test
    await Usuario.deleteMany({});
    await Regla.deleteMany({});

    const conjunto = await Conjunto.findOne({ nombre: 'Los Tulipanes' });

    usuario = await Usuario.create({
      nombre: 'AdminReglas',
      email: `admin${Date.now()}@correo.com`, // Email único
      password: '123456',
      direccion: 'Admin',
      rol: 'Residente',
      conjunto: conjunto._id
    });

    // Simular sesión
    app.use((req, res, next) => {
      req.session.usuario = {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        conjunto: usuario.conjunto
      };
      next();
    });
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it('POST /guardar → debe crear una nueva regla', async () => {
    const res = await request(app)
      .post('/administracion/reglas/guardar')
      .send({
        conjunto: 'Los Tulipanes',
        titulo: 'Horarios Permitidos',
        descripcion: 'Visitas solo de 8am a 8pm'
      });

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.be.true;

    const regla = await Regla.findOne({ titulo: 'Horarios Permitidos' });
    expect(regla).to.exist;

    reglaId = regla._id;
  });

  it('GET / → debe mostrar la lista de reglas', async () => {
    await Regla.create({
      conjunto: 'Los Tulipanes',
      titulo: 'Regla Visible',
      descripcion: 'Debe aparecer en la vista'
    });

    const res = await request(app).get('/administracion/reglas');
    expect(res.status).to.equal(200);
    expect(res.text.includes('Regla Visible')).to.be.true;
  });

  it('PUT /actualizar/:id → debe editar una regla existente', async () => {
    const regla = await Regla.create({
      conjunto: 'Los Tulipanes',
      titulo: 'Regla Editar',
      descripcion: 'Original'
    });

    const res = await request(app)
      .put(`/administracion/reglas/actualizar/${regla._id}`)
      .send({
        conjunto: 'Los Tulipanes',
        titulo: 'Regla Editada',
        descripcion: 'Editada correctamente'
      });

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.be.true;

    const actualizada = await Regla.findById(regla._id);
    expect(actualizada.titulo).to.equal('Regla Editada');
  });

  it('DELETE /eliminar/:id → debe eliminar una regla', async () => {
    const regla = await Regla.create({
      conjunto: 'Los Tulipanes',
      titulo: 'Regla Eliminar',
      descripcion: 'Eliminar esta'
    });

    const res = await request(app)
      .delete(`/administracion/reglas/eliminar/${regla._id}`);

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.be.true;

    const borrada = await Regla.findById(regla._id);
    expect(borrada).to.be.null;
  });
});
