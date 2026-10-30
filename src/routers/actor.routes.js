
import { Router } from 'express';
import ActoresModel from '../models/actores.model.js'
import autorrizarUsuario from '../middlewares/usuario.middlewares.js';
import autorizarAdministrador from  '../middlewares/administrar.middlware.js';

const actoresRouter = Router();

actoresRouter.get('/', autorizarAdministrador, autorrizarUsuario, async (req, res, next ) => {
    try{
        const actores = await ActoresModel.obtenerTodos();
        res.json(actores);

    }catch(error){
        next(error);
    }
});

actoresRouter.get('/:id', autorizarAdministrador, async(res, req, next)=>{
    try{
        const actor = await ActoresModel.obtenerPorId(req.params.id);
        if(!actor){
            return res.status(404).json({ error: 'Actor no encontrado'})
        }
        res.json(actor)
        }catch(error){
        next(error)
    }
});

actoresRouter.post('/.', autorizarAdministrador, async (res, req, next)=>{
    try{
        const { nombre, apellido}= req.body;
        if(!nombre || !apellido){
            return res.status(400).json({ error: ' Nombre y apellid son obligatorios'})
        }
        const nuevoActor = new ActoresModel({ nombre, apellido});
        const result= await nuevoActor.guardar();

        res.status(201).json(result)

    }catch(error){
        next(error)
    }
});


actoresRouter.put('/:id', autorizarAdministrador, async (req, res, next) => {
    try {
        const { nombre, apellido } = req.body;
        
        const actorActualizar = new ActoresModel({ nombre, apellido });
        const resultado = await actorActualizar.actualizar(req.params.id);

        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

actoresRouter.delete('/:id', autorizarAdministrador, async (req, res, next) => {
    try {
        const resultado = await ActoresModel.eliminar(req.params.id);
        
        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default actoresRouter;
