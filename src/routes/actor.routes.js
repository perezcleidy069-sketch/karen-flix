
import { Router } from 'express';
import { validarActor } from '../middlewares/actor.middleware.js';
// Importa tu controlador de actores aquí
// import { crearActor } from '../controllers/actor.controller.js';

const router = Router();

router.post('/actores', validarActor, crearActor);

export default router;