// test/integration/parqueaderoRoutes.spec.js
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import session from "express-session";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { expect } from "chai";

import parqueaderoRoutes from "../../routes/parqueaderoRoutes.js";
import { connectDatabase } from "../../config/database.js";
import Usuario from "../../models/Usuario.js";
import Parqueadero from "../../models/Parqueadero.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../");

describe("parqueaderoRoutes (integración)", function () {
  this.timeout(30000);

  let mongod;
  let app;
  let usuario;

  before(async () => {
    // Iniciar base de datos en memoria
    mongod = await MongoMemoryServer.create();
    const uri = new URL(mongod.getUri());

    process.env.MONGO_HOST = uri.hostname;
    process.env.MONGO_PORT = uri.port;
    process.env.MONGO_DB = uri.pathname.slice(1) || "testdb";

    await connectDatabase();

    // Crear usuario de sesión
    usuario = await Usuario.create({
      nombre: "Administrador1",
      email: `admin${Date.now()}@correo.com`,
      password: "123456",
      rol: "Residente", // debe coincidir con enum de Usuario
    });

    app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
      session({
        secret: "test-secret",
        resave: false,
        saveUninitialized: false,
      })
    );

    // Simular sesión activa
    app.use((req, res, next) => {
      req.session.usuario = {
        id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      };
      next();
    });

    app.set("view engine", "ejs");
    app.set("views", path.join(PROJECT_ROOT, "views"));
    app.use("/parqueadero", parqueaderoRoutes);
  });

  // 🔁 Limpiar base de datos antes y después de cada prueba
  beforeEach(async () => {
    await Parqueadero.deleteMany({});
  });

  afterEach(async () => {
    await Parqueadero.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it("POST /parqueadero/agregar → debe agregar un parqueadero", async () => {
    const res = await request(app).post("/parqueadero/agregar").send({
      codigo: "P101",
      tipo: "residente",
      estado: "disponible",
      asignadoA: "",
      ubicacion: "Bloque A",
      costo: 0,
    });

    expect(res.status).to.equal(200); // Porque responde con JSON
    expect(res.body.exito).to.be.true;

    const registros = await Parqueadero.find();
    expect(registros).to.have.lengthOf(1);
    expect(registros[0].codigo).to.equal("P101");
  });

  it("GET /parqueadero → debe mostrar el inventario", async () => {
    await Parqueadero.create({
      codigo: "P202",
      tipo: "arrendado",
      estado: "ocupado",
      asignadoA: "user123",
      ubicacion: "Bloque B",
      costo: 3000,
    });

    const res = await request(app).get("/parqueadero");
    expect(res.status).to.equal(200);
    expect(res.text.includes("P202")).to.be.true;
  });

  it("DELETE /parqueadero/eliminar/:id → debe eliminar parqueadero", async () => {
    const p = await Parqueadero.create({
      codigo: "P303",
      tipo: "visitante",
      estado: "reservado",
      ubicacion: "Bloque C",
      costo: 2000,
    });

    const res = await request(app).delete(`/parqueadero/eliminar/${p._id}`);
    expect(res.status).to.equal(200);
    expect(res.body.exito).to.be.true;

    const total = await Parqueadero.countDocuments();
    expect(total).to.equal(0);
  });
});
