
import { Router } from 'express';
import CategoriaModel from '../models/categoria.model.js'
import autorrizarUsuario from '../middlewares/usuario.middlewares.js';
import autorizarAdministrador from  '../middlewares/administrar.middlware.js';

const categoriaRouter = Router();

categoriaRouter.get('/', autorizarAdministrador, autorrizarUsuario, async (req, res, next ) => {
    try{
        const categorias = await CategoriaModel.obtenerTodos();
        res.json(categorias);

    }catch(error){
        next(error);
    }
});

categoriaRouter.get('/:id', autorizarAdministrador, async(res, req, next)=>{
    try{
        const categoria = await CategoriaModel.obtenerPorId(req.params.id);
        if(!categoria){
            return res.status(404).json({ error: 'Actor no encontrado'})
        }
        res.json(categoria)
        }catch(error){
        next(error)
    }
});

categoriaRouter.post('/.', autorizarAdministrador, async (res, req, next)=>{
    try{
        const { nombre}= req.body;
        if(!nombre){
            return res.status(400).json({ error: ' Nombre es obligatorios'})
        }
        const nuevoCategoria = new CategoriaModel({ nombre});
        const result= await nuevoCategoria.guardar();

        res.status(201).json(result)

    }catch(error){
        next(error)
    }
});


categoriaRouter.put('/:id', autorizarAdministrador, async (req, res, next) => {
    try {
        const { nombre} = req.body;
        
        const categoriaActualizar = new CategoriaModel({ nombre});
        const resultado = await categoriaActualizar.actualizar(req.params.id);

        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

categoriaRouter.delete('/:id', autorizarAdministrador, async (req, res, next) => {
    try {
        const resultado = await CategoriaModel.eliminar(req.params.id);
        
        if (!resultado.success) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default categoriaRouter;
