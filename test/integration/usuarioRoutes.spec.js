// test/integration/usuarioRoutes.spec.js
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { expect } from 'chai';

import usuarioRoutes from '../../routes/usuarioRoutes.js';
import { connectDatabase } from '../../config/database.js';
import Usuario from '../../models/Usuario.js';
import Conjunto from '../../models/Conjunto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../');

describe('usuarioRoutes (integración)', function () {
  this.timeout(30000);
  let mongod;
  let app;

  before(async () => {
    // Mongo en memoria
    mongod = await MongoMemoryServer.create();
    const uri = new URL(mongod.getUri());

    process.env.MONGO_HOST = uri.hostname;
    process.env.MONGO_PORT = uri.port;
    process.env.MONGO_DB = (uri.pathname && uri.pathname.slice(1)) || 'testdb';

    await connectDatabase();

    // Asegurar que el conjunto Los Tulipanes existe (NO se borra)
    await Conjunto.findOneAndUpdate(
      { nombre: 'Los Tulipanes' },
      { nombre: 'Los Tulipanes', ciudad: 'Bogotá', direccion: 'Cra 1 # 23-45' },
      { upsert: true, new: true }
    );

    app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Sesión simulada (si se usa en /usuarios/perfil)
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
      })
    );

    app.set('view engine', 'ejs');
    app.set('views', path.join(PROJECT_ROOT, 'views'));
    app.use('/usuarios', usuarioRoutes);
  });

  beforeEach(async () => {
    // Limpiar solo usuarios antes de cada prueba
    await Usuario.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it('POST /usuarios → debe crear un usuario y redirigir a /login', async () => {
    const res = await request(app)
      .post('/usuarios')
      .type('form')
      .send({
        nombre: 'TestUser',
        correo: 'test1222345678@correo.com',
        password: '123456',
        confirmar: '123456',
        direccion: 'Torre 4 Apto 201',
        conjunto: 'Los Tulipanes'
      });

    expect(res.status).to.equal(302);
    expect(res.header.location).to.equal('/login');

    const usuario = await Usuario.findOne({ email: 'test1222345678@correo.com' });
    expect(usuario).to.exist;
    expect(usuario.nombre).to.equal('TestUser');
  });

  it('GET /usuarios → debe mostrar lista de usuarios', async () => {
    // Crear un usuario manualmente
    await Usuario.create({
      nombre: 'TestUser',
      email: 'test@correo.com',
      password: '123456',
      direccion: 'Apto 101',
      rol: 'Residente',
      conjunto: (await Conjunto.findOne({ nombre: 'Los Tulipanes' }))._id
    });

    const res = await request(app).get('/usuarios');
    expect(res.status).to.equal(200);
    expect(res.text.includes('TestUser')).to.be.true;
  });
});
