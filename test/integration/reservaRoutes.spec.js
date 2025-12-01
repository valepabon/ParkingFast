// test/integration/reservaRoutes.spec.js
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import session from "express-session";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { expect } from "chai";

import reservaRoutes from "../../routes/reservaRoutes.js";
import { connectDatabase } from "../../config/database.js";
import Usuario from "../../models/Usuario.js";
import Conjunto from "../../models/Conjunto.js";
import Reserva from "../../models/Reserva.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../");

describe("reservaRoutes (integración)", function () {
  this.timeout(30000);

  let mongod;
  let app;
  let usuario;
  let conjunto;
  let reservaId;

  before(async () => {
    // Iniciar Mongo en memoria
    mongod = await MongoMemoryServer.create();
    const uri = new URL(mongod.getUri());

    process.env.MONGO_HOST = uri.hostname;
    process.env.MONGO_PORT = uri.port;
    process.env.MONGO_DB = uri.pathname?.slice(1) || "testdb";

    await connectDatabase();

    // ⚠️ LIMPIAR TODO MENOS CONJUNTOS
    await Usuario.deleteMany({});
    await Reserva.deleteMany({});

    // Crear conjunto si no existe
    conjunto = await Conjunto.findOneAndUpdate(
      { nombre: "Los Tulipanes" },
      { nombre: "Los Tulipanes", ciudad: "Bogotá", direccion: "Cra 1 # 23-45" },
      { upsert: true, new: true }
    );

    // Crear usuario
    usuario = await Usuario.create({
      nombre: "Residente1",
      email: `reserva${Date.now()}@correo.com`,
      password: "123456",
      direccion: "Apto 101",
      rol: "Residente",
      conjunto: conjunto._id
    });

    // App express
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      session({
        secret: "test-secret",
        resave: false,
        saveUninitialized: false
      })
    );

    // Simular login
    app.use((req, res, next) => {
      req.session.usuario = {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        conjunto: usuario.conjunto
      };
      next();
    });

    app.set("view engine", "ejs");
    app.set("views", path.join(PROJECT_ROOT, "views"));

    app.use("/reservas", reservaRoutes);
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  /* =====================================================
       1. Crear reserva
  ====================================================== */
  it("POST /reservas/crear → debe crear una reserva", async () => {
    const res = await request(app).post("/reservas/crear").send({
      fecha: "2025-12-01",
      horaInicio: "10:00",
      horaFin: "11:00",
      placa: "ABC-123",
      parqueadero: "P-10"
    });

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.equal(true);

    const creada = await Reserva.findOne({ placa: "ABC-123" });
    expect(creada).to.not.be.null;

    reservaId = creada._id.toString();
  });

  /* =====================================================
       2. Mostrar reservas
  ====================================================== */
  it("GET /reservas → debe mostrar las reservas del usuario", async () => {
    const res = await request(app).get("/reservas");

    expect(res.status).to.equal(200);
    expect(res.text.includes("ABC-123")).to.equal(true);
  });

  /* =====================================================
       3. Editar reserva (sin conflicto)
  ====================================================== */
  it("PUT /reservas/editar/:id → debe editar una reserva sin conflicto", async () => {
    const res = await request(app)
      .put(`/reservas/editar/${reservaId}`)
      .send({
        fecha: "2025-12-01",
        horaInicio: "09:00",
        horaFin: "10:00",
        placa: "XYZ-987",
        parqueadero: "P-10"
      });

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.equal(true);

    const editada = await Reserva.findById(reservaId);
    expect(editada.placa).to.equal("XYZ-987");
  });

  /* =====================================================
       4. Eliminar reserva
  ====================================================== */
  it("POST /reservas/eliminar/:id → debe eliminar la reserva", async () => {
    const res = await request(app).post(`/reservas/eliminar/${reservaId}`);

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.equal(true);

    const existe = await Reserva.findById(reservaId);
    expect(existe).to.be.null;
  });
});
