const CategoriaModel = require('../models/categoria.model');
const CategoriaDTO = require('../dto/categoria.dto');

class CategoriaController {
    static async listar(req, res) {
        try {
            const categorias = await CategoriaModel.obtenerTodas();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async crear(req, res) {
        try {
            const datosDTO = new CategoriaDTO(req.body);
            const id = await CategoriaModel.crear(datosDTO);
            res.status(201).json({ id, mensaje: 'Categoría creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CategoriaController;