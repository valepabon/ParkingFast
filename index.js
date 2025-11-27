import express from 'express';
import path from 'path';
import session from 'express-session';
import { connectDatabase } from './config/database.js';
import { __dirname } from './util/__dirname.js';

import usuarioRoutes from './routes/usuarioRoutes.js';
import indexRoutes from './routes/indexRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reservaRoutes from './routes/reservaRoutes.js';
import comunidadRoutes from './routes/comunidadRoutes.js';
import parqueaderoRoutes from "./routes/parqueaderoRoutes.js";
import administracionRoutes from './routes/administracionRoutes.js';
import reservaAdminRoutes from "./routes/reservaAdminRoutes.js";
import reglaRoutes from './routes/reglaRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Sesiones
app.use(session({
  secret: 'conectapark-secret',
  resave: false,
  saveUninitialized: false,
}));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', indexRoutes);
app.use('/', authRoutes); // Login y Signup
app.use('/usuarios', usuarioRoutes);
app.use('/reservas', reservaRoutes);
app.use('/comunidad', comunidadRoutes);
app.use("/administracion/parqueaderos", parqueaderoRoutes);
app.use('/administracion', administracionRoutes);
app.use("/administracion/reservas", reservaAdminRoutes);
app.use('/administracion/reglas', reglaRoutes);

// Conexión a BD
await connectDatabase();

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

