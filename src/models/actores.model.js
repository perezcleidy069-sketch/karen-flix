import { pool } from '../config/db.js';

export default class ActoresModel {
    constructor(data) {
        this.id = data.id || null;
        this.nombre = data.nombre;
        this.apellido = data.apellido || null;
        this.foto_url = data.foto_url || null;
    }

    async guardar() {
        const [result] = await pool.execute(
            'INSERT INTO actores (nombre, apellido, foto_url) VALUES (?, ?, ?)',
            [this.nombre, this.apellido, this.foto_url]
        );
        this.id = result.insertId;
        return { success: true, id: this.id, mensaje: 'Actor registrado exitosamente' };
    }

    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT id, nombre, apellido, foto_url FROM actores ORDER BY nombre, apellido');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.execute('SELECT id, nombre, apellido, foto_url FROM actores WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async actualizar(id = this.id) {
        const [result] = await pool.execute(
            'UPDATE actores SET nombre = ?, apellido = ?, foto_url = ? WHERE id = ?',
            [this.nombre, this.apellido, this.foto_url, id]
        );
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Actor actualizado exitosamente' : 'Actor no encontrado' };
    }

    static async eliminar(id) {
        const [result] = await pool.execute('DELETE FROM actores WHERE id = ?', [id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Actor eliminado exitosamente' : 'Actor no encontrado' };
    }

    obtenerDatos() {
        return { id: this.id, nombre: this.nombre, apellido: this.apellido, foto_url: this.foto_url };
    }
}
