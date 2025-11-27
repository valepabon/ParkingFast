// test/integration/usuarioRoutes.spec.js
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

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
    app.use(express.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.set('views', path.join(PROJECT_ROOT, 'views'));
    app.use('/usuarios', usuarioRoutes);
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
        correo: 'test12345678@correo.com',
        password: '123456',
        confirmar: '123456',
        direccion: 'Torre 4 Apto 201',
        conjunto: 'Los Tulipanes'
      });

    if (res.status !== 302) throw new Error('❌ No redirigió al crear usuario');

    const usuario = await Usuario.findOne({ email: 'test@correo.com' });
    if (!usuario) throw new Error('❌ Usuario no creado en la base de datos');
  });

  it('GET /usuarios → debe mostrar lista de usuarios', async () => {
    const res = await request(app).get('/usuarios');
    if (res.status !== 200) throw new Error('❌ Error al obtener usuarios');

    if (!res.text.includes('TestUser')) {
      throw new Error('❌ El nombre del usuario no aparece en la vista');
    }
  });
});

