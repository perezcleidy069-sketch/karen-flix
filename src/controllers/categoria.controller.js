import CategoriaModel from '../models/categoria.model.js';

export default class CategoriaController {
    static async listar(req, res, next) {
        try {
            return res.json(await CategoriaModel.obtenerTodos());
        } catch (error) {
            return next(error);
        }
    }

    static async obtenerPorId(req, res, next) {
        try {
            const categoria = await CategoriaModel.obtenerPorId(req.params.id);
            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            return res.json(categoria);
        } catch (error) {
            return next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const resultado = await new CategoriaModel(req.body).guardar();
            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    }
}
