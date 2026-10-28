import { pool } from '../config/db.js';

export default class ResenaModel {
    #id;
    #idpelicula;
    #idusuario;
    #comentarios;
    #fechaResena;
    #punteo;
    
    constructor(data) {
        this.#id = data.id || null;
        this.#idpelicula = data.idpelicula;
        this.#idusuario = data.idusuario;
        this.#comentarios = data.comentarios;
        this.#fechaResena = data.fechaResena || new Date();
        this.#punteo = data.punteo;
    }

    async guardar() {
        try {
            const query = 'INSERT INTO resenas (idpelicula, idusuario, comentarios, fechaResena, punteo) VALUES (?, ?, ?, ?, ?)';
            const valores = [
                this.#idpelicula,
                this.#idusuario,
                this.#comentarios,
                this.#fechaResena,
                this.#punteo
            ];

            const [result] = await pool.execute(query, valores);
            this.#id = result.insertId;

            return {
                success: true,
                id: this.#id,
                mensaje: 'Reseña registrada exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTodos() {
        try {
            const [filas] = await pool.query('SELECT id, idpelicula, idusuario, comentarios, fechaResena, punteo FROM resenas');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerPorId(id) {
        try {
            const [filas] = await pool.execute('SELECT id, idpelicula, idusuario, comentarios, fechaResena, punteo FROM resenas WHERE id = ?', [id]);
            return filas[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id) {
        try {
            const resenaId = id || this.#id;
            const query = 'UPDATE resenas SET idpelicula = ?, idusuario = ?, comentarios = ?, fechaResena = ?, punteo = ? WHERE id = ?';
            const valores = [
                this.#idpelicula,
                this.#idusuario,
                this.#comentarios,
                this.#fechaResena,
                this.#punteo,
                resenaId
            ];

            const [result] = await pool.execute(query, valores);

            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Reseña actualizada exitosamente' : 'Reseña no encontrada'
            };
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await pool.execute('DELETE FROM resenas WHERE id = ?', [id]);
            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Reseña eliminada exitosamente' : 'Reseña no encontrada'
            };
        } catch (error) {
            throw error;
        }
    }

    obtenerDatos() {
        return {
            id: this.#id,
            idpelicula: this.#idpelicula,
            idusuario: this.#idusuario,
            comentarios: this.#comentarios,
            fechaResena: this.#fechaResena,
            punteo: this.#punteo
        };
    }
}