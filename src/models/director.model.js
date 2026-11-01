import { pool } from '../config/db.js';

export default class DirectorModel {
    constructor(data) {
        this.id = data.id || null;
        this.nombre = data.nombre;
        this.apellido = data.apellido || null;
        this.foto_url = data.foto_url || null;
    }

    async guardar() {
        const [result] = await pool.execute(
            'INSERT INTO directores (nombre, apellido, foto_url) VALUES (?, ?, ?)',
            [this.nombre, this.apellido, this.foto_url]
        );
        this.id = result.insertId;
        return { success: true, id: this.id, mensaje: 'Director registrado exitosamente' };
    }

    static async obtenerTodos() {
        const [rows] = await pool.query('SELECT id, nombre, apellido, foto_url FROM directores ORDER BY nombre, apellido');
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.execute('SELECT id, nombre, apellido, foto_url FROM directores WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async actualizar(id = this.id) {
        const [result] = await pool.execute(
            'UPDATE directores SET nombre = ?, apellido = ?, foto_url = ? WHERE id = ?',
            [this.nombre, this.apellido, this.foto_url, id]
        );
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Director actualizado exitosamente' : 'Director no encontrado' };
    }

    static async eliminar(id) {
        const [result] = await pool.execute('DELETE FROM directores WHERE id = ?', [id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Director eliminado exitosamente' : 'Director no encontrado' };
    }

    obtenerDatos() {
        return { id: this.id, nombre: this.nombre, apellido: this.apellido, foto_url: this.foto_url };
    }
}
