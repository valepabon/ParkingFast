
import { Router } from 'express';

const router = Router();

router.get('/inicio', (req, res) => {
  const { usuario } = req.session;
  if (!usuario) return res.redirect('/login');

  res.render('inicio', {
    titulo: 'Inicio',
    usuario, 
  });
});

export default router;

