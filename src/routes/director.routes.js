import { Router } from 'express';
import { validarDirector } from '../middlewares/director.middleware.js';
// Importa tu controlador de directores aquí
// import { crearDirector } from '../controllers/director.controller.js';

const router = Router();

router.post('/directores', validarDirector, crearDirector);

export default router;