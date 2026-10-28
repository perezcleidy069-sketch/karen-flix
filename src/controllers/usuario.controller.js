const UsuarioModel = require('../models/usuario.model');
const UsuarioDTO = require('../dto/usuario.dto');

class UsuarioController {
    static async listar(req, res) {
        try {
            const usuarios = await UsuarioModel.obtenerTodos();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async crear(req, res) {
        try {
            const datosDTO = new UsuarioDTO(req.body);
            const id = await UsuarioModel.crear(datosDTO);
            res.status(201).json({ id, mensaje: 'Usuario creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UsuarioController;