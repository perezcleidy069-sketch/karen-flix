import UsuarioModel from '../models/usuario.model.js';

export default class UsuarioController {
    static async listar(req, res, next) {
        try {
            return res.json(await UsuarioModel.obtenerTodos());
        } catch (error) {
            return next(error);
        }
    }

    static async obtenerPorId(req, res, next) {
        try {
            const usuario = await UsuarioModel.obtenerPorId(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            return res.json(usuario);
        } catch (error) {
            return next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const resultado = await new UsuarioModel(req.body).guardar();
            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    }
}
