import { Router } from 'express';
import { validarCategoria } from '../middlewares/categoria.middleware.js';
// Importa tu controlador de categorías aquí
// import { crearCategoria } from '../controllers/categoria.controller.js';

const router = Router();

router.post('/categorias', validarCategoria, crearCategoria);

export default router;