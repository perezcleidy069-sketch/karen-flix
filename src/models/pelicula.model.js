import { pool } from '../config/db.js';

export default class PeliculaModel {
    #id;
    #titulo;
    #sinopsis;
    #anio_estreno;
    #idcategoria;
    #idDirector;
    #image;
    #trailer_url;

    constructor(data) {
        this.#id = data.id || null;
        this.#titulo = data.titulo;
        this.#sinopsis = data.sinopsis;
        this.#anio_estreno = data.anio_estreno;
        this.#idcategoria = data.idcategoria;
        this.#idDirector = data.idDirector || data.iddirector;
        this.#image = data.image;
        this.#trailer_url = data.trailer_url;
    }

    async guardar() {
        try {
            const query = 'INSERT INTO peliculas (titulo, sinopsis, anio_estreno, idcategoria, idDirector, image, trailer_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const valores = [
                this.#titulo,
                this.#sinopsis,
                this.#anio_estreno,
                this.#idcategoria,
                this.#idDirector,
                this.#image,
                this.#trailer_url
            ];

            const [result] = await pool.execute(query, valores);
            this.#id = result.insertId;

            return {
                success: true,
                id: this.#id,
                mensaje: 'Película registrada exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    static async obtenerTodos() {
        try {
            const [filas] = await pool.query('SELECT id, titulo, sinopsis, anio_estreno, idcategoria, idDirector, image, trailer_url FROM peliculas');
            return filas;
        } catch (error) {
            throw error;
        }
    }

    static async obtenerPorId(id) {
        try {
            const [filas] = await pool.execute('SELECT id, titulo, sinopsis, anio_estreno, idcategoria, idDirector, image, trailer_url FROM peliculas WHERE id = ?', [id]);
            return filas[0] || null;
        } catch (error) {
            throw error;
        }
    }

    async actualizar(id) {
        try {
            const peliculaId = id || this.#id;
            const query = 'UPDATE peliculas SET titulo = ?, sinopsis = ?, anio_estreno = ?, idcategoria = ?, idDirector = ?, image = ?, trailer_url = ? WHERE id = ?';
            const valores = [
                this.#titulo,
                this.#sinopsis,
                this.#anio_estreno,
                this.#idcategoria,
                this.#idDirector,
                this.#image,
                this.#trailer_url,
                peliculaId
            ];

            const [result] = await pool.execute(query, valores);

            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Película actualizada exitosamente' : 'Película no encontrada'
            };
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await pool.execute('DELETE FROM peliculas WHERE id = ?', [id]);
            return {
                success: result.affectedRows > 0,
                mensaje: result.affectedRows > 0 ? 'Película eliminada exitosamente' : 'Película no encontrada'
            };
        } catch (error) {
            throw error;
        }
    }

    obtenerDatos() {
        return {
            id: this.#id,
            titulo: this.#titulo,
            sinopsis: this.#sinopsis,
            anio_estreno: this.#anio_estreno,
            idcategoria: this.#idcategoria,
            idDIrector: this.#idDirector,
            image: this.#image,
            trailer_url: this.#trailer_url
        };
    }
}