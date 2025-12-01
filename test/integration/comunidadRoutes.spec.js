// test/integration/comunidadRoutes.spec.js
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import session from "express-session";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { expect } from "chai";

import comunidadRoutes from "../../routes/comunidadRoutes.js";
import { connectDatabase } from "../../config/database.js";
import Usuario from "../../models/Usuario.js";
import Comunidad from "../../models/Comunidad.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../../");

describe("comunidadRoutes (integración)", function () {
  this.timeout(30000);

  let mongod;
  let app;
  let usuario;

  before(async () => {
    // Iniciar servidor en memoria
    mongod = await MongoMemoryServer.create();
    const uri = new URL(mongod.getUri());

    process.env.MONGO_HOST = uri.hostname;
    process.env.MONGO_PORT = uri.port;
    process.env.MONGO_DB = (uri.pathname && uri.pathname.slice(1)) || "testdb";

    await connectDatabase();

    // Configurar Express
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

    // EJS y rutas
    app.set("view engine", "ejs");
    app.set("views", path.join(PROJECT_ROOT, "views"));

    // Crear usuario de prueba
    usuario = await Usuario.create({
      nombre: "UsuarioTest",
      email: `test${Date.now()}@correo.com`,
      password: "123456",
      direccion: "Apto 101",
      rol: "Residente",
    });

    // Middleware de sesión simulada
    app.use((req, res, next) => {
      req.session.usuario = {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
      };
      next();
    });

    app.use("/comunidad", comunidadRoutes);
  });

  // Limpiar colecciones antes de cada test
  beforeEach(async () => {
    await Comunidad.deleteMany({});
  });

  // Limpiar colecciones después de cada test
  afterEach(async () => {
    await Comunidad.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it("POST /comunidad/agregar → debe crear una publicación", async () => {
    const res = await request(app).post("/comunidad/agregar").send({
      tipoParqueadero: "cubierto",
      tipoVehiculo: "carro",
      precio: 5000,
      fecha: "2025-12-01",
      telefono: "3210009999",
      ubicacion: "Los Tulipanes",
      descripcion: "Disponible",
    });

    expect(res.status).to.equal(200);
    expect(res.body.exito).to.be.true;

    const publicaciones = await Comunidad.find();
    expect(publicaciones).to.have.lengthOf(1);
    expect(publicaciones[0].descripcion).to.equal("Disponible");
  });

  it("GET /comunidad/mis-publicaciones → debe mostrar publicaciones del usuario", async () => {
    await Comunidad.create({
      tipoParqueadero: "cubierto",
      tipoVehiculo: "carro",
      precio: 5000,
      fechaDisponible: "2025-12-01",
      propietario: usuario._id,
      telefono: "3210009999",
      conjunto: "Los Tulipanes",
      descripcion: "Disponible",
    });

    const res = await request(app).get("/comunidad/mis-publicaciones");
    expect(res.status).to.equal(200);
    expect(res.text.includes("Disponible")).to.be.true;
  });

  it("DELETE /comunidad/eliminar/:id → debe eliminar publicación", async () => {
    const pub = await Comunidad.create({
      tipoParqueadero: "cubierto",
      tipoVehiculo: "carro",
      precio: 5000,
      fechaDisponible: "2025-12-01",
      propietario: usuario._id,
      telefono: "3210009999",
      conjunto: "Los Tulipanes",
      descripcion: "Disponible",
    });

    const res = await request(app).delete(`/comunidad/eliminar/${pub._id}`);
    expect(res.status).to.equal(200);
    expect(res.body.exito).to.be.true;

    const total = await Comunidad.countDocuments();
    expect(total).to.equal(0);
  });
});
