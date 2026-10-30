import ActoresModel from '../models/actores.model.js';

export default class ActorController {
    static async listar(req, res, next) {
        try {
            return res.json(await ActoresModel.obtenerTodos());
        } catch (error) {
            return next(error);
        }
    }

    static async obtenerPorId(req, res, next) {
        try {
            const actor = await ActoresModel.obtenerPorId(req.params.id);
            if (!actor) {
                return res.status(404).json({ error: 'Actor no encontrado' });
            }
            return res.json(actor);
        } catch (error) {
            return next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const resultado = await new ActoresModel(req.body).guardar();
            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    }
}
