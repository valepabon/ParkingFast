## Guía de Pruebas Unitarias e Integración

Este documento explica paso a paso cómo funcionan y cómo ejecutar las pruebas del proyecto **ConectaPark**, desarrollado con **Express + MVC + Mongoose + EJS**.

Incluye:

- Pruebas unitarias para la capa de servicios (`userService.js`)  
- Pruebas de integración para rutas (`usuarioRoutes.js`)  
- Uso de MongoDB en memoria 🧠  
- Scripts para ejecución organizada  

---

## 🧩 1. Tecnologías usadas para pruebas

| Librería               | Uso                              |
|-----------------------|-----------------------------------|
| **Mocha**             | Runner de test                    |
| **Chai**              | Aserciones (expect)               |
| **Sinon**             | Stubs y mocks en pruebas unitarias|
| **Supertest**         | Requests HTTP simulados           |
| **mongodb-memory-server** | MongoDB en memoria para integración |

---

## 🛠️ 2. Instalación

```bash
npm install
npm i -D mocha chai sinon supertest mongodb-memory-server
```
---

## 📁 3. Estructura de pruebas

```bash
test/
├── unit/
│   └── userService.spec.js
└── integration/
    └── usuarioRoutes.spec.js
docs/
└── PRUEBAS.md

```

---

## 🏷️ 4. Scripts recomendados en package.json

En `package.json` agrega/ajusta estos scripts:

```json

  {
  "scripts": {
    "test": "node --experimental-specifier-resolution=node ./node_modules/mocha/bin/mocha \"test/**/*.spec.js\" --timeout 15000",
    "test:unit": "node --experimental-specifier-resolution=node ./node_modules/mocha/bin/mocha \"test/unit/*.spec.js\" --timeout 10000",
    "test:integration": "node --experimental-specifier-resolution=node ./node_modules/mocha/bin/mocha \"test/integration/*.spec.js\" --timeout 30000"
  }
}

```

---

## 🔍 5. Detalle de Pruebas

## ✅ Pruebas Unitarias  
Todas usan `sinon.stub()` para aislar las funciones y evitar conexión real a la base de datos.

---

### 🧩 userService
- `getUsers()`
- `getUserById(id)`
- `getUserByEmail(email)`
- `createUser(data)`
- `updateUser(id, data)`
- `deleteUser(id)`

---

### 🧩 reservaService
- `getReservasByUsuario(usuarioId)`
- `getReservaById(id)`
- `createReserva(data)`
- `updateReserva(id, data)`
- `deleteReserva(id)`
- `existeConflictoHorario(...)`

---

### 🧩 reglaService
- `crearRegla(data)`
- `obtenerReglas()`
- `obtenerReglaPorId(id)`
- `actualizarRegla(id, data)`
- `eliminarRegla(id)`

---

### 🧩 comunidadService y parqueaderoService
Incluyen métodos:
- `crear`
- `editar`
- `eliminar`
- `obtenerTodos`
- Otros métodos auxiliares según funcionalidad

---

## 🔗 Pruebas de Integración  
Utilizan **Supertest** y **mongodb-memory-server** para levantar una base de datos en memoria y simular la app Express real, incluyendo:
- Sesión
- Rutas
- Controladores
- Vistas EJS

---

### ✅ usuarioRoutes
- **POST** `/usuarios` → crea usuario  
- **GET** `/usuarios` → lista usuarios  
- **GET** `/form/usuarios/:id` → muestra formulario  
- **POST** `/update/usuarios/:id` → edita usuario  
- **POST** `/delete/usuarios/:id` → elimina usuario  

---

### ✅ reservaRoutes
- **POST** `/reservas/crear` → crea reserva  
- **GET** `/reservas` → muestra reservas del usuario  
- **PUT** `/reservas/editar/:id` → edita reserva sin conflicto  
- **POST** `/reservas/eliminar/:id` → elimina reserva  

---

### ✅ reglaRoutes
- **POST** `/guardar` → crea nueva regla  
- **GET** `/` → lista reglas  
- **PUT** `/actualizar/:id` → actualiza regla  
- **DELETE** `/eliminar/:id` → elimina regla  

---

### ✅ comunidadRoutes
- **POST** `/comunidad/agregar` → nueva publicación  
- **GET** `/comunidad/mis-publicaciones` → publicaciones del usuario  
- **DELETE** `/comunidad/eliminar/:id` → elimina publicación  

---

### ✅ parqueaderoRoutes
- **POST** `/parqueadero/agregar` → crea parqueadero  
- **GET** `/parqueadero` → muestra inventario  
- **DELETE** `/parqueadero/eliminar/:id` → elimina parqueadero  

## ▶️ 6. Cómo ejecutar las pruebas

1. Instala dependencias:
   ```bash
   npm install
   npm i -D mocha chai sinon supertest mongodb-memory-server
   ```

2. Ejecuta **todas** las pruebas:
   ```bash
   npm test
   ```

3. Solo **unitarias**:
   ```bash
   npm run test:unit
   ```

4. Solo **integración**:
   ```bash
   npm run test:integration
   ```

> Si te aparece algún error de imports, verifica tu versión de Node (recomendado 18+) o prueba quitando/agregando la flag `--experimental-specifier-resolution=node` en los scripts.

---
---

## 🧼 Limpieza entre Pruebas

En cada archivo `.spec.js`, los tests de integración ejecutan los sguiente para que cada prueba parte desde una base limpia
(excepto Conjunto, que se preserva):

```js
await Usuario.deleteMany({});
await Reserva.deleteMany({});
```
---
---

## ✅ Resultados del Último Test


### 🧪 comunidadRoutes (integración)
- ✔ **POST** `/comunidad/agregar` → debe crear una publicación  
- ✔ **GET** `/comunidad/mis-publicaciones` → debe mostrar publicaciones del usuario  
- ✔ **DELETE** `/comunidad/eliminar/:id` → debe eliminar publicación  

---

### 🧪 parqueaderoRoutes (integración)
- ✔ **POST** `/parqueadero/agregar` → debe agregar un parqueadero  
- ✔ **GET** `/parqueadero` → debe mostrar el inventario  
- ✔ **DELETE** `/parqueadero/eliminar/:id` → debe eliminar parqueadero  

---

### 🧪 reglaRoutes (integración)
- ✔ **POST** `/guardar` → debe crear una nueva regla  
- ✔ **GET** `/` → debe mostrar la lista de reglas  
- ✔ **PUT** `/actualizar/:id` → debe editar una regla existente  
- ✔ **DELETE** `/eliminar/:id` → debe eliminar una regla  

---

### 🧪 reservaRoutes (integración)
- ✔ **POST** `/reservas/crear` → debe crear una reserva  
- ✔ **GET** `/reservas` → debe mostrar las reservas del usuario  
- ✔ **PUT** `/reservas/editar/:id` → debe editar una reserva sin conflicto  
- ✔ **POST** `/reservas/eliminar/:id` → debe eliminar la reserva  

---

### 🧪 usuarioRoutes (integración)
- ✔ **POST** `/usuarios` → debe crear un usuario y redirigir a /login  
- ✔ **GET** `/usuarios` → debe mostrar lista de usuarios  

---

## 🧩 Pruebas Unitarias

### comunidadService
- ✔ `obtenerTodas` debe retornar todas las publicaciones  
- ✔ `obtenerPorUsuario` debe retornar publicaciones del usuario  
- ✔ `crearPublicacion` debe guardar correctamente  
- ✔ `eliminarPublicacion` debe ejecutar `findByIdAndDelete`  
- ✔ `obtenerPorId` debe ejecutar `findById`  
- ✔ `actualizarPublicacion` debe ejecutar `findByIdAndUpdate`  

---

### parqueaderoService
- ✔ `obtenerTodos` debe retornar todos los parqueaderos  
- ✔ `crearParqueadero` debe guardar un nuevo parqueadero  
- ✔ `eliminarParqueadero` debe ejecutar `findByIdAndDelete`  
- ✔ `obtenerPorId` debe retornar un parqueadero por ID  
- ✔ `actualizarParqueadero` debe ejecutar `findByIdAndUpdate`  

---

### reglaService
- ✔ `crearRegla` debe guardar una nueva regla  
- ✔ `obtenerReglas` debe devolver todas las reglas  
- ✔ `obtenerReglaPorId` debe devolver la regla correspondiente  
- ✔ `actualizarRegla` debe llamar a `findByIdAndUpdate` correctamente  
- ✔ `eliminarRegla` debe llamar a `findByIdAndDelete`  

---

### reservaService
- ✔ `getReservasByUsuario` debe retornar reservas del usuario  
- ✔ `createReserva` debe guardar una nueva reserva  
- ✔ `updateReserva` debe llamar a `findByIdAndUpdate` con los datos correctos  
- ✔ `deleteReserva` debe llamar a `findByIdAndDelete` con el ID  

---

### userService
- ✔ `getUsers` → debería retornar lista de usuarios con conjunto  
- ✔ `getUserById` → debería retornar un usuario por ID con conjunto  
- ✔ `getUserByEmail` → debería encontrar un usuario por email  
- ✔ `createUser` → debería crear un nuevo usuario  
- ✔ `updateUser` → debería actualizar un usuario por ID  
- ✔ `deleteUser` → debería eliminar un usuario por ID  



