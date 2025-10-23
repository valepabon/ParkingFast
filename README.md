# 🚗 ConectaPark (ParkingFast)

**ConectaPark** es una aplicación web desarrollada con **Node.js**, **Express** y **EJS**, que permite la **gestión de parqueaderos** en conjuntos residenciales, ofreciendo módulos para residentes, administradores y comunidad de parqueaderos.

---

## 🌐 Descripción General

ConectaPark facilita la interacción entre los residentes y la administración de un conjunto residencial para:
- Reservar y gestionar parqueaderos de visitantes.  
- Administrar los espacios disponibles del conjunto.  
- Publicar y consultar parqueaderos disponibles para arriendo o préstamo en la comunidad.  

La aplicación está diseñada bajo una arquitectura modular, con vistas dinámicas generadas mediante **EJS** y estilos gestionados desde **CSS puro**.

---

## 🧩 Funcionalidades Principales

### 👤 **Módulo de Usuario**
- Registro e inicio de sesión.
- Edición de perfil (nombre, correo, conjunto, torre/apartamento).
- Activación o desactivación de notificaciones.

### 🅿️ **Módulo de Reservas**
- Crear, editar o eliminar reservas de parqueaderos.
- Visualizar reservas activas e históricas.
- Modal emergente para edición y cancelación.

### 🏢 **Módulo de Administración**
- Gestión del inventario de parqueaderos.
- Control de estados: *disponible*, *ocupado*, *reservado*.
- Definición y administración de reglas de conjunto.
- Panel de control para portería y administración.

### 🌍 **Módulo de Comunidad**
- Visualización de parqueaderos publicados por otros usuarios.
- Creación de publicaciones propias (con precio, tipo y disponibilidad).
- Edición y eliminación de publicaciones con confirmación vía *pop-up*.

---

## 🧱 Arquitectura del Proyecto

