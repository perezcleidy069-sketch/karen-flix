import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export default class UsuarioModel {
    #id;
    #nombre;
    #apellido;
    #email;
    #telefono;
    #contrasena;
    #role;
    #activo;
    #likes;
    #dislikes;

    constructor(data) {
        this.#id = data.id || null;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
        this.#email = data.email;
        this.#telefono = data.telefono;
        this.#contrasena = data.contrasena || data.constrasena;
        this.#role = data.role;
        this.#activo = data.activo ?? true;
        this.#likes = data.likes || 0;
        this.#dislikes = data.dislikes || 0;
    }

    async guardar() {
        try {
            const seguridad = 10;
            const contrasenaCriptada = await bcrypt.hash(this.#contrasena, seguridad);

            const query = 'INSERT INTO usuarios (nombre, apellido, email, telefono, contrasena, role, activo, likes, dislikes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

            const valores = [
                this.#nombre,
                this.#apellido,
                this.#email,
                this.#telefono,
                contrasenaCriptada,
                this.#role,
                this.#activo,
                this.#likes,
                this.#dislikes
            ];

            const [result] = await pool.execute(query, valores);
            this.#id = result.insertId;

            return {
                success: true,
                id: this.#id,
                mensaje: `El ${this.#role} ha sido registrado exitosamente`
            };
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTodos() {
        try {
            const [filas] = await pool.query('SELECT id, nombre, apellido, email, telefono, role, activo, likes, dislikes FROM usuarios');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerPorId(id) {
        try {
            const [filas] = await pool.execute('SELECT id, nombre, apellido, email, telefono, role, activo, likes, dislikes FROM usuarios WHERE id = ?', [id]);
            return filas[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id) {
        try {
            const userId = id || this.#id;
            let contrasenaCriptada = this.#contrasena;

            if (this.#contrasena && !this.#contrasena.startsWith('$2b$')) {
                contrasenaCriptada = await bcrypt.hash(this.#contrasena, 10);
            }

            const query = 'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, contrasena = ?, role = ?, activo = ?, likes = ?, dislikes = ? WHERE id = ?';

            const valores = [
                this.#nombre,
                this.#apellido,
                this.#email,
                this.#telefono,
                contrasenaCriptada,
                this.#role,
                this.#activo,
                this.#likes,
                this.#dislikes,
                userId
            ];

            const [result] = await pool.execute(query, valores);

            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Usuario actualizado exitosamente' : 'Usuario no encontrado'
            };
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Usuario eliminado exitosamente' : 'Usuario no encontrado'
            };
        } catch (error) {
            throw error;
        }
    }

    static async cambiarEstado(id, activo) {
        try {
            const [result] = await pool.execute('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, id]);
            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Estado actualizado exitosamente' : 'Usuario no encontrado'
            };
        } catch (error) {
            throw error;
        }
    }

    obtenerDatos() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            apellido: this.#apellido,
            email: this.#email,
            telefono: this.#telefono,
            role: this.#role,
            activo: this.#activo,
            likes: this.#likes,
            dislikes: this.#dislikes
        };
    }
}