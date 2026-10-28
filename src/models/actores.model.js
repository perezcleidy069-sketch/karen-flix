import { pool } from '../config/db.js';

export default class ActoresModel {
    #id;
    #nombre;
    #apellido;

    constructor(data) {
        this.#id = data.id || null;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
    }

    async guardar() {
        try {
            const query = 'INSERT INTO actores (nombre, apellido) VALUES (?, ?)';
            const valores = [this.#nombre, this.#apellido];

            const [result] = await pool.execute(query, valores);
            this.#id = result.insertId;

            return {
                success: true,
                id: this.#id,
                mensaje: 'Actor registrado exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTodos() {
        try {
            const [filas] = await pool.query('SELECT id, nombre, apellido FROM actores');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerPorId(id) {
        try {
            const [filas] = await pool.execute('SELECT id, nombre, apellido FROM actores WHERE id = ?', [id]);
            return filas[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id) {
        try {
            const actorId = id || this.#id;
            const query = 'UPDATE actores SET nombre = ?, apellido = ? WHERE id = ?';
            const valores = [this.#nombre, this.#apellido, actorId];

            const [result] = await pool.execute(query, valores);

            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Actor actualizado exitosamente' : 'Actor no encontrado'
            };
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await pool.execute('DELETE FROM actores WHERE id = ?', [id]);
            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Actor eliminado exitosamente' : 'Actor no encontrado'
            };
        } catch (error) {
            throw error;
        }
    }

    obtenerDatos() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            apellido: this.#apellido
        };
    }
}