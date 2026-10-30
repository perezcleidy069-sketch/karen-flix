import PeliculaModel from '../models/pelicula.model.js';

export default class PeliculaController {
    static async listar(req, res, next) {
        try {
            const incluirPendientes = req.user?.role === 'administrador';
            return res.json(await PeliculaModel.obtenerTodos({ incluirPendientes }));
        } catch (error) {
            return next(error);
        }
    }

    static async obtenerPorId(req, res, next) {
        try {
            const pelicula = await PeliculaModel.obtenerPorId(req.params.idpelicula, {
                incluirPendientes: req.user?.role === 'administrador'
            });
            if (!pelicula) {
                return res.status(404).json({ error: 'Película no encontrada' });
            }
            return res.json(pelicula);
        } catch (error) {
            return next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const admin = req.user.role === 'administrador';
            const pelicula = new PeliculaModel({
                ...req.body,
                creada_por: req.user.id,
                estado: admin ? 'aprobada' : 'pendiente',
                aprobada_por: admin ? req.user.id : null
            });
            const resultado = await pelicula.guardar();
            return res.status(201).json(resultado);
        } catch (error) {
            return next(error);
        }
    }
}
