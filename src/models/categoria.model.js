import { pool } from '../config/db.js';

export default class CategoriaModel {
    #id;
    #nombre;

    constructor(data) {
        this.#id = data.id || null;
        this.#nombre = data.nombre;
    }

    async guardar() {
        try {
            const query = 'INSERT INTO categorias (nombre) VALUES (?)';
            const valores = [this.#nombre];

            const [result] = await pool.execute(query, valores);
            this.#id = result.insertId;

            return {
                success: true,
                id: this.#id,
                mensaje: 'Categoría registrada exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTodos() {
        try {
            const [filas] = await pool.query('SELECT id, nombre FROM categorias');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerPorId(id) {
        try {
            const [filas] = await pool.execute('SELECT id, nombre FROM categorias WHERE id = ?', [id]);
            return filas[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id) {
        try {
            const categoriaId = id || this.#id;
            const query = 'UPDATE categorias SET nombre = ? WHERE id = ?';
            const valores = [this.#nombre, categoriaId];

            const [result] = await pool.execute(query, valores);

            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Categoría actualizada exitosamente' : 'Categoría no encontrada'
            };
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await pool.execute('DELETE FROM categorias WHERE id = ?', [id]);
            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Categoría eliminada exitosamente' : 'Categoría no encontrada'
            };
        } catch (error) {
            throw error;
        }
    }

    obtenerDatos() {
        return {
            id: this.#id,
            nombre: this.#nombre
        };
    }
}