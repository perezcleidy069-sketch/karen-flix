import { pool } from '../config/db.js';

export default class PeliculaModel {
    constructor(data) {
        this.idpelicula = data.idpelicula || data.id || null;
        this.titulo = data.titulo;
        this.sinopsis = data.sinopsis || null;
        this.anio_estreno = data.anio_estreno || null;
        this.duracion_minutos = data.duracion_minutos || null;
        this.idcategoria = data.idcategoria;
        this.iddirector = data.iddirector || data.idDirector || null;
        this.imagen = data.imagen || null;
        this.trailer_url = data.trailer_url || null;
        this.tipo = data.tipo || 'pelicula';
        this.creada_por = data.creada_por || null;
        this.estado = data.estado || 'pendiente';
        this.aprobada_por = data.aprobada_por || null;
    }

    async guardar() {
        const [result] = await pool.execute(
            `INSERT INTO peliculas
             (titulo, sinopsis, anio_estreno, duracion_minutos, idcategoria, iddirector,
              imagen, trailer_url, tipo, estado, creada_por, aprobada_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                this.titulo, this.sinopsis, this.anio_estreno, this.duracion_minutos,
                this.idcategoria, this.iddirector, this.imagen, this.trailer_url,
                this.tipo, this.estado, this.creada_por, this.aprobada_por
            ]
        );
        this.idpelicula = result.insertId;
        return { success: true, id: this.idpelicula, estado: 'pendiente' };
    }

    static async obtenerTodos({ incluirPendientes = false } = {}) {
        const [rows] = await pool.query(
            `SELECT idpelicula, titulo, sinopsis, anio_estreno, duracion_minutos,
                    idcategoria, iddirector, imagen, trailer_url, tipo, estado
             FROM peliculas ${incluirPendientes ? '' : "WHERE estado = 'aprobada'"} ORDER BY titulo`
        );
        return rows;
    }

    static async obtenerPorId(id, { incluirPendientes = false } = {}) {
        const visibility = incluirPendientes ? '' : " AND estado = 'aprobada'";
        const [rows] = await pool.execute(
            `SELECT idpelicula, titulo, sinopsis, anio_estreno, duracion_minutos,
                    idcategoria, iddirector, imagen, trailer_url, tipo, estado
             FROM peliculas WHERE idpelicula = ?${visibility}`,
            [id]
        );
        return rows[0] || null;
    }

    async actualizar(id = this.idpelicula, { requiereAprobacion = true, aprobadaPor = null } = {}) {
        const estado = requiereAprobacion ? 'pendiente' : this.estado;
        const [result] = await pool.execute(
            `UPDATE peliculas
             SET titulo = ?, sinopsis = ?, anio_estreno = ?, duracion_minutos = ?,
                 idcategoria = ?, iddirector = ?, imagen = ?, trailer_url = ?, tipo = ?,
                 estado = ?, aprobada_por = ?
             WHERE idpelicula = ?`,
            [
                this.titulo, this.sinopsis, this.anio_estreno, this.duracion_minutos,
                this.idcategoria, this.iddirector, this.imagen, this.trailer_url,
                this.tipo, estado, requiereAprobacion ? null : aprobadaPor, id
            ]
        );
        this.estado = estado;
        this.aprobada_por = requiereAprobacion ? null : aprobadaPor;
        return {
            success: result.affectedRows > 0,
            mensaje: result.affectedRows
                ? requiereAprobacion ? 'Película actualizada y enviada a aprobación' : 'Película actualizada'
                : 'Película no encontrada'
        };
    }

    static async eliminar(id) {
        const [result] = await pool.execute('DELETE FROM peliculas WHERE idpelicula = ?', [id]);
        return { success: result.affectedRows > 0, mensaje: result.affectedRows ? 'Película eliminada exitosamente' : 'Película no encontrada' };
    }

    obtenerDatos() {
        return {
            idpelicula: this.idpelicula,
            titulo: this.titulo,
            sinopsis: this.sinopsis,
            anio_estreno: this.anio_estreno,
            duracion_minutos: this.duracion_minutos,
            idcategoria: this.idcategoria,
            iddirector: this.iddirector,
            imagen: this.imagen,
            trailer_url: this.trailer_url,
            tipo: this.tipo,
            creada_por: this.creada_por,
            estado: this.estado,
            aprobada_por: this.aprobada_por
        };
    }
}
