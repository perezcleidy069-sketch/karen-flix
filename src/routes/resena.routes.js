import { Router } from 'express';
import { validarResena } from '../middlewares/resena.middleware.js';
// Importa tu controlador de reseñas aquí
// import { crearResena } from '../controllers/resena.controller.js';

const router = Router();

router.post('/resenas', validarResena, crearResena);

export default router;