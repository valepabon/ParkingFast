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

## 🔍 5. ¿Qué prueban los tests?
### 🧪 5.1 Pruebas Unitarias — services/userService.js
Estas pruebas no tocan la base de datos.
Usamos Sinon para simular los métodos de Mongoose:

-find
-findOne
-findById
-create
-save
-updateOne
-deleteOne

Casos cubiertos:

-getUsers() → debe llamar Usuario.find().populate()

-getUserById(id) → debe llamar Usuario.findById(id)

-getUserByEmail(email) → debe llamar Usuario.findOne({ email })

-createUser(data) → debe llamar save()

-updateUser(id, data) → debe llamar updateOne

-deleteUser(id) → debe llamar deleteOne

Esto valida la lógica del servicio totalmente aislada.

### 🔗 5.2 Pruebas de Integración — routes/usuarioRoutes.js

Aquí probamos el flujo completo:

✔ Express
→ ✔ usuarioRoutes
→ ✔ usuarioController
→ ✔ Mongoose
→ ✔ MongoDB (en memoria)
→ ✔ Render con EJS

Casos probados:
-POST /usuarios

Crea un usuario en MongoDB en memoria

Responde con redirección 302

-GET /

Renderiza usuarios.ejs

Debe mostrar el usuario recién creado

-GET /form/usuarios/:id

Devuelve correctamente el formulario de edición

-POST /update/usuarios/:id

Actualiza el usuario

Verifica el cambio en la BD y en la vista HTML

-POST /delete/usuarios/:id

Elimina el registro

Verifica que ya no existe en MongoDB

```
test/
  unit/
    userService.spec.js         # Pruebas de la capa de servicios con Sinon (stubs de Mongoose)
  integration/
    userRoutes.spec.js          # Pruebas de rutas con Supertest + MongoDB en memoria
docs/
  PRUEBAS.md                    # Esta guía
```

---

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