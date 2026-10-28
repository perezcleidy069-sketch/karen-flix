const PeliculaModel = require('../models/pelicula.model');
const PeliculaDTO = require('../dto/pelicula.dto');

class PeliculaController {
    static async listar(req, res) {
        try {
            const peliculas = await PeliculaModel.obtenerTodas();
            res.json(peliculas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async crear(req, res) {
        try {
            const datosDTO = new PeliculaDTO(req.body);
            const id = await PeliculaModel.crear(datosDTO);
            res.status(201).json({ id, mensaje: 'Película creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PeliculaController;