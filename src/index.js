import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Emular __dirname (porque en ESModules no existe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Middleware para JSON y archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configurar motor EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Bienvenido a mi nuevo proyecto Express' });
});

//login
app.get("/login", (req, res) => {
    res.render("login", { titulo: "Login" });
  });
  

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

//Registro 
app.get('/signup', (req, res) => {
    res.render('signup', { titulo: 'Registro' });
  });
//Inicio
app.get('/inicio', (req, res) => {
    res.render('inicio', { titulo: 'Inicio' });
  });

//Perfil 
app.get('/perfil', (req, res) => {
    res.render('perfil', { titulo: 'Perfil de Usuario' });
  });
  
//Reservas
app.get('/reservas', (req, res) => {
    res.render('reservas', { titulo: 'Reservas' });
  });

//Administracion
app.get('/administracion', (req, res) => {
    res.render('administracion', { titulo: 'Administracion' });
  });

//Administración - Gestión Reservas
app.get('/administracion/reservas', (req, res) => {
    res.render('gestion_reservas', { titulo: 'Gestión de Reservas' });
  });

// Administración - Parqueaderos
app.get('/administracion/parqueaderos', (req, res) => {
    res.render('parqueaderos', { titulo: 'Inventario de Parqueaderos' });
  });
  
// Administración - Parqueaderos - Agregar parqueadero
app.get('/administracion/parqueaderos/agregar', (req, res) => {
    res.render('agregar_parqueadero', { titulo: 'Agregar Parqueadero' });
  });

// Administración - Reglas
app.get('/administracion/reglas', (req, res) => {
    res.render('reglas_conjunto', { titulo: 'Reglas del Conjunto' });
  });

// Administración - Reglas - Agregar Regla
app.get('/administracion/reglas/agregar', (req, res) => {
    res.render('regla_agregar', { titulo: 'Agregar Regla' });
  });
  
// Comunidad de Parqueaderos
app.get('/comunidad', (req, res) => {
    res.render('comunidad_parqueaderos', { titulo: 'Comunidad de Parqueaderos' });
  });
  
  
// Comunidad de Parqueaderos - Mis publicaciones
app.get('/comunidad/mis-publicaciones', (req, res) => {
    res.render('mis_publicaciones', { titulo: 'Mis Publicaciones' });
  });
  
// Comunidad de Parqueaderos - Nueva publicación
app.get('/comunidad/agregar', (req, res) => {
    res.render('comunidad_agregar', { titulo: 'Nueva Publicación de Parqueadero' });
  });