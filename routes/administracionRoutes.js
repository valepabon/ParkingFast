import express from 'express';
const router = express.Router();

// Mostrar vista principal del módulo de administración
router.get('/', (req, res) => {
  res.render('administracion', { titulo: 'Administración' });

});

export default router;
