# 🏙️ ConectaPark - Sistema de Gestión de Parqueaderos

Proyecto desarrollado con una arquitectura monolítica basada en el patrón **MVC (Modelo - Vista - Controlador)**, utilizando tecnologías modernas como **Express**, **MongoDB**, **EJS** y herramientas de pruebas automatizadas.

---

## 🧱 Arquitectura MVC


```
Capa de presentación (vista): Es la capa que interactua con el usuario.

Capa de Negocio (Controlador): Es la capa que se encarga de procesar la lógica del negocio

Capa de Persistencia (modelo): Es la capa en donde la información se procesa para ser almacenada en la BD
```

---

## 📁 Estructura del Proyecto


```txt
conecta-park/
│
├── config/            # Configuración de base de datos y entorno
├── controllers/       # Controladores que procesan la lógica de negocio
├── models/            # Modelos de datos de MongoDB con Mongoose
├── public/            # Archivos estáticos (CSS, JS, imágenes)
├── routes/            # Definición de rutas Express por entidad
├── services/          # Lógica de acceso a datos y operaciones de negocio
├── utils/             # Funciones auxiliares
├── views/             # Plantillas EJS para renderizado del frontend
├── test/              # Pruebas unitarias y de integración
│
├── .env               # Variables de entorno
├── package.json       # Dependencias y scripts
│
└── docs/
    └── PRUEBAS.md     # Documentación de pruebas
```
---

## 🛠️ Tecnologías utilizadas

| Tecnología     | Descripción                                 |
|----------------|---------------------------------------------|
| **Express.js** | Framework para construir aplicaciones web   |
| **MongoDB**    | Base de datos NoSQL para almacenar documentos|
| **Mongoose**   | ODM para modelar objetos MongoDB            |
| **EJS**        | Motor de plantillas para renderizar vistas  |
| **Node.js**    | Entorno de ejecución del backend            |

---

## 🧩 Base de Datos

La base de datos MongoDB contiene las siguientes colecciones:

- `usuarios`
- `reservas`
- `comunidades`
- `reglas`
- `parqueaderos`
- `conjuntos`

Se usa Mongoose para definir esquemas, relaciones (`populate`) y validaciones.

---

## 🔁 Rutas principales

| Entidad        | Ruta base                 | Operaciones Soportadas     |
|----------------|---------------------------|-----------------------------|
| Usuarios       | `/usuarios`               | CRUD completo               |
| Reservas       | `/reservas`               | Crear, Listar, Editar, Eliminar |
| Comunidad      | `/comunidad`              | Publicar, Ver, Eliminar     |
| Reglas         | `/administracion/reglas`  | CRUD completo               |
| Parqueaderos   | `/parqueadero`            | Agregar, Listar, Eliminar  |

---

## ✅ Operaciones Implementadas

- Registro y autenticación de usuarios
- Creación y gestión de reservas de parqueaderos
- Publicación y visualización de mensajes comunitarios
- Gestión de reglas del conjunto residencial
- Administración de parqueaderos por conjunto

---

## 🔄 Flujo de la Aplicación (MVC)

```txt
Usuario
   ↓
Ruta HTTP (GET, POST, PUT, DELETE)
   ↓
Controlador → Procesa la lógica del negocio
   ↓
Servicio → Interactúa con los modelos y la base de datos
   ↓
Modelo (Mongoose) → Almacena/consulta datos en MongoDB
   ↑
Vista (EJS) ← Renderiza la respuesta
   ↑
Usuario ← Recibe la respuesta


---

## 🧪 Pruebas Automatizadas

El proyecto incluye pruebas **unitarias** y de **integración** utilizando herramientas modernas.

### 🧪 Pruebas Unitarias

Prueban funciones de servicios de forma aislada, simulando las dependencias con `Sinon`.

Ubicación: `test/unit/*.spec.js`

Tecnologías:
- `mocha`
- `chai`
- `sinon`

Ejemplos:
- `userService.getUserByEmail()`
- `reservaService.createReserva()`
- `reglaService.eliminarRegla()`

### 🔗 Pruebas de Integración

Prueban rutas reales Express con MongoDB simulado en memoria (`mongodb-memory-server`).

Ubicación: `test/integration/*.spec.js`

Tecnologías:
- `supertest`
- `mongodb-memory-server`

Rutas probadas:
- `POST /usuarios`
- `GET /reservas`
- `PUT /reservas/editar/:id`
- `DELETE /administracion/reglas/eliminar/:id`

---

## ▶️ Cómo ejecutar las pruebas

1. Instala las dependencias:

```bash
npm install

2. Ejecutar solo pruebas unitarias:
```bash
npm run test:unit


3. Ejecutar solo pruebas de integración:
```bash
npm run test:integration


```txt

Las pruebas de integración usan una base de datos temporal en memoria (mongodb-memory-server).
No afectan tu base de datos real.

---
## 📌 Mensajes Comunes de Commit

| Tipo        | Significado                                             |
|-------------|---------------------------------------------------------|
| **feat:**   | Nueva funcionalidad                                     |
| **fix:**    | Corrección de errores                                   |
| **refactor:** | Mejora de código sin cambiar funcionalidades           |
| **test:**   | Agregado o modificación de pruebas                      |
| **chore:**  | Tareas de configuración o mantenimiento                 |
| **style:**  | Cambios en estilos (CSS, EJS)                           |
| **docs:**   | Cambios en documentación (README, etc.)                |


## 📊 Resumen de Cantidad de Pruebas

- ✅ **comunidadRoutes** → 3 pruebas  
- ✅ **parqueaderoRoutes** → 3 pruebas  
- ✅ **reglaRoutes** → 4 pruebas  
- ✅ **reservaRoutes** → 4 pruebas  
- ✅ **usuarioRoutes** → 2 pruebas  

---

- ✅ **comunidadService** → 6 pruebas  
- ✅ **parqueaderoService** → 5 pruebas  
- ✅ **reglaService** → 5 pruebas  
- ✅ **reservaService** → 4 pruebas  
- ✅ **userService** → 6 pruebas  

---

# 🎉 TOTAL: **42 pruebas** pasaron exitosamente

## 📚 Documentación Adicional

👉 Ver **docs/PRUEBAS.md** para más detalles técnicos sobre los tests.

---

## 💡 Créditos

Desarrollado por **Valentina Pabon** — Proyecto académico de gestión de parqueaderos con arquitectura MVC.
