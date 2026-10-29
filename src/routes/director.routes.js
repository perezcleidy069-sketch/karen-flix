
import { Router } from 'express';
import DirectorModel from '../models/director.model.js'
import autorrizarUsuario from '../middlewares/usuario.middlewares';
import autorizarAdministrador from  '../middlewares/administrar.middlware';

const directoresRouter = Router();

directoresRouter.get('/', autorizarAdministrador, autorrizarUsuario, async (req, res, next ) => {
    try{
        const directores = await DirectorModel.obtenerTodos();
        res.json(directores);

    }catch(error){
        next(error);
    }
});

directoresRouter.get('/:id', autorizarAdministrador, async(res, req, next)=>{
    try{
        const actor = await DirectorModel.obtenerPorId(req.params.id);
        if(!actor){
            return res.status(404).json({ error: 'Actor no encontrado'})
        }
        res.json(actor)
        }catch(error){
        next(error)
    }
});

directoresRouter.post('/.', autorizarAdministrador, async (res, req, next)=>{
    try{
        const { nombre, apellido}= req.body;
        if(!nombre || !apellido){
            return res.status(400).json({ error: ' Nombre y apellid son obligatorios'})
        }
        const nuevoActor = new DirectorModel({ nombre, apellido});
        const result= await nuevoActor.guardar();

        res.status(201).json(result)

    }catch(error){
        next(error)
    }
});


directoresRouter.put('/:id', autorizarAdministrador, async (req, res, next) => {
    try {
        const { nombre, apellido } = req.body;
        
        const directorActualizar = new DirectorModel({ nombre, apellido });
        const resultado = await directorActualizar.actualizar(req.params.id);

        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

directoresRouter.delete('/:id', autorizarAdministrador, async (req, res, next) => {
    try {
        const resultado = await DirectorModel.eliminar(req.params.id);
        
        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default directoresRouter;
