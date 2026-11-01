import { pool } from '../config/db.js';

export default class ResenaModel {
    constructor(data) {
        this.id = data.id || null;
        this.idpelicula = data.idpelicula;
        this.idusuario = data.idusuario;
        this.titulo = data.titulo;
        this.comentarios = data.comentarios;
        this.puntaje = data.puntaje;
    }

    async guardar() {
        const [result] = await pool.execute(
            `INSERT INTO resenas (idpelicula, idusuario, titulo, comentarios, fechaResena, puntaje)
             VALUES (?, ?, ?, ?, CURDATE(), ?)`,
            [this.idpelicula, this.idusuario, this.titulo, this.comentarios, this.puntaje]
        );
        this.id = result.insertId;
        return { success: true, id: this.id, mensaje: 'Reseña registrada exitosamente' };
    }

    static async obtenerTodos() {
        const [rows] = await pool.query(
            'SELECT id, idpelicula, idusuario, titulo, comentarios, fechaResena, puntaje FROM resenas ORDER BY fechaResena DESC'
        );
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.execute(
            'SELECT id, idpelicula, idusuario, titulo, comentarios, fechaResena, puntaje FROM resenas WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    async actualizar(id = this.id) {
        const [result] = await pool.execute(
            'UPDATE resenas SET titulo = ?, comentarios = ?, puntaje = ? WHERE id = ?',
            [this.titulo, this.comentarios, this.puntaje, id]
        );
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Reseña actualizada exitosamente' : 'Reseña no encontrada' };
    }

    static async eliminar(id) {
        const [result] = await pool.execute('DELETE FROM resenas WHERE id = ?', [id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Reseña eliminada exitosamente' : 'Reseña no encontrada' };
    }

    obtenerDatos() {
        return {
            id: this.id,
            idpelicula: this.idpelicula,
            idusuario: this.idusuario,
            titulo: this.titulo,
            comentarios: this.comentarios,
            puntaje: this.puntaje
        };
    }
}
