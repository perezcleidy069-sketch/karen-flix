import { pool } from '../config/db.js';

export default class CategoriaModel {
    constructor(data) {
        this.id = data.id || null;
        this.nombre = data.nombre;
        this.imagen_url = data.imagen_url || null;
    }

    async guardar() {
        const [result] = await pool.execute(
            'INSERT INTO categorias (nombre, imagen_url) VALUES (?, ?)',
            [this.nombre, this.imagen_url]
        );
        this.id = result.insertId;
        return { success: true, id: this.id, mensaje: 'Categoría registrada exitosamente' };
    }

    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT id, nombre, imagen_url FROM categorias ORDER BY nombre');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.execute('SELECT id, nombre, imagen_url FROM categorias WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async actualizar(id = this.id) {
        const [result] = await pool.execute(
            'UPDATE categorias SET nombre = ?, imagen_url = ? WHERE id = ?',
            [this.nombre, this.imagen_url, id]
        );
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Categoría actualizada exitosamente' : 'Categoría no encontrada' };
    }

    static async eliminar(id) {
        const [result] = await pool.execute('DELETE FROM categorias WHERE id = ?', [id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Categoría eliminada exitosamente' : 'Categoría no encontrada' };
    }

    obtenerDatos() {
        return { id: this.id, nombre: this.nombre, imagen_url: this.imagen_url };
    }
}
