// test/integration/reservaRoutes.spec.js
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import reservaRoutes from '../../routes/reservaRoutes.js';
import { connectDatabase } from '../../config/database.js';
import Usuario from '../../models/Usuario.js';
import Conjunto from '../../models/Conjunto.js';
import Reserva from '../../models/Reserva.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../');

describe('reservaRoutes (integración)', function () {
  this.timeout(30000);
  let mongod;
  let app;
  let usuario;

  before(async () => {
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
      nombre: 'Residente1',
      email: 'residente12345@correo.com',
      password: '123456',
      direccion: 'Apto 101',
      rol: 'Residente',
      conjunto: conjunto._id
    });

    app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));

    // Middleware para simular login
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
    app.use('/reservas', reservaRoutes);
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it('POST /reservas → debe crear una reserva y redirigir', async () => {
    const res = await request(app)
      .post('/reservas')
      .type('form')
      .send({
        fecha: '2025-12-01',
        horaInicio: '10:00',
        horaFin: '11:30',
        placa: 'XXX-111'
      });

    if (res.status !== 302) throw new Error('❌ No redirigió al crear reserva');

    const reservas = await Reserva.find({ usuario: usuario._id });
    if (reservas.length !== 1) throw new Error('❌ Reserva no creada');
  });

  it('GET /reservas → debe mostrar las reservas del usuario', async () => {
    const res = await request(app).get('/reservas');
    if (res.status !== 200) throw new Error('❌ Error al renderizar reservas');

    if (!res.text.includes('XXX-111')) {
      throw new Error('❌ La reserva creada no aparece en la vista');
    }
  });
});
