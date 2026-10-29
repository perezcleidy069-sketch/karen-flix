import { Router } from 'express';
import { validarPelicula } from '../middlewares/pelicula.middleware.js';
// Importa tu controlador de películas aquí
// import { crearPelicula } from '../controllers/pelicula.controller.js';

const router = Router();

router.post('/peliculas', validarPelicula, crearPelicula);

export default router;