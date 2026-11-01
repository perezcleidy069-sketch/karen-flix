import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

export default class UsuarioModel {
    constructor(data) {
        this.id = data.id || null;
        this.nombre = data.nombre;
        this.apellido = data.apellido || null;
        this.email = data.email;
        this.telefono = data.telefono || null;
        this.contrasena = data.contrasena;
        this.avatar_url = data.avatar_url || null;
        this.role = 'usuario';
        this.activo = data.activo ?? true;
    }

    async guardar() {
        const passwordHash = await bcrypt.hash(this.contrasena, 12);
        const [result] = await pool.execute(
            `INSERT INTO usuarios
             (nombre, apellido, email, telefono, contrasena, \`role\`, activo, avatar_url)
             VALUES (?, ?, ?, ?, ?, 'usuario', ?, ?)`,
            [
                this.nombre, this.apellido, this.email, this.telefono,
                passwordHash, this.activo, this.avatar_url
            ]
        );
        this.id = result.insertId;
        return { success: true, id: this.id, mensaje: 'Usuario registrado exitosamente' };
    }

    static async obtenerTodos() {
        const [rows] = await pool.query(
            `SELECT id, nombre, apellido, email, telefono, \`role\`, activo, avatar_url, created_at
             FROM usuarios ORDER BY id`
        );
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await pool.execute(
            `SELECT id, nombre, apellido, email, telefono, \`role\`, activo, avatar_url, created_at
             FROM usuarios WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    async actualizar(id = this.id) {
        const [result] = await pool.execute(
            `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, avatar_url = ?
             WHERE id = ?`,
            [this.nombre, this.apellido, this.email, this.telefono, this.avatar_url, id]
        );
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Usuario actualizado exitosamente' : 'Usuario no encontrado' };
    }

    static async eliminar(id) {
        const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Usuario eliminado exitosamente' : 'Usuario no encontrado' };
    }

    static async cambiarEstado(id, activo) {
        const [result] = await pool.execute('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Estado actualizado exitosamente' : 'Usuario no encontrado' };
    }

    obtenerDatos() {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            telefono: this.telefono,
            role: this.role,
            activo: this.activo,
            avatar_url: this.avatar_url
        };
    }
}
