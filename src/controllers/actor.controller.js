const ActorModel = require('../models/actor.model');
const ActorDTO = require('../dto/actor.dto');

class ActorController {
    static async listar(req, res) {
        try {
            const actores = await ActorModel.obtenerTodos();
            res.json(actores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async crear(req, res) {
        try {
            const datosDTO = new ActorDTO(req.body);
            const id = await ActorModel.crear(datosDTO);
            res.status(201).json({ id, mensaje: 'Actor creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ActorController;