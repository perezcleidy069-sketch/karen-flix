import { Router } from 'express';
import ResenaModel from '../models/resena.model.js';
import autorizarUsuario from '../middlewares/usuario.middlewares.js'; // Tu middleware de cookie

const resenasRouter = Router();

// 1. Obtener todas las reseñas (Puede ser público o requerir login, según prefieras)
resenasRouter.get('/', async (req, res, next) => {
    try {
        const resenas = await ResenaModel.obtenerTodos();
        res.json(resenas);
    } catch (error) {
        next(error);
    }
});

// 2. Obtener una reseña por ID
resenasRouter.get('/:id', async (req, res, next) => {
    try {
        const resena = await ResenaModel.obtenerPorId(req.params.id);
        if (!resena) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.json(resena);
    } catch (error) {
        next(error);
    }
});

// 3. CREAR RESEÑA (Protegido con autorizarUsuario)
resenasRouter.post('/', autorizarUsuario, async (req, res, next) => {
    try {
        const { idpelicula, comentarios, punteo } = req.body;
        
        // El idusuario NUNCA debe venir del body del cliente por seguridad.
        // Lo sacamos de la cookie firmada gracias al middleware 'autorizarUsuario'.
        const idusuario = req.user.id; 

        if (!idpelicula || !comentarios || !punteo) {
            return res.status(400).json({ error: 'Película, comentarios y punteo son obligatorios' });
        }


        const nuevaResena = new ResenaModel({ 
            idpelicula, 
            idusuario, 
            comentarios, 
            punteo 
        });
        
        const resultado = await nuevaResena.guardar();
        res.status(201).json(resultado);

    } catch (error) {
        next(error);
    }
});


resenasRouter.put('/:id', autorizarUsuario, async (req, res, next) => {
    try {
        const { idpelicula, comentarios, punteo } = req.body;
        const idusuario = req.user.id; 

        const resenaActualizar = new ResenaModel({ idpelicula, idusuario, comentarios, punteo });
        const resultado = await resenaActualizar.actualizar(req.params.id);

        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});


resenasRouter.delete('/:id', autorizarUsuario, async (req, res, next) => {
    try {
        const resultado = await ResenaModel.eliminar(req.params.id);
        
        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default resenasRouter;