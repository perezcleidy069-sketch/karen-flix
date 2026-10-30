import { conTransaccion, crearErrorHttp } from './db-transaction.js';

async function recalcularPromedio(connection, idpelicula) {
    await connection.execute(
        `UPDATE peliculas
         SET calificacion_promedio = COALESCE(
                 (SELECT AVG(puntaje) FROM resenas WHERE idpelicula = ?),
                 0
             ),
             total_resenas = (
                 SELECT COUNT(*) FROM resenas WHERE idpelicula = ?
             )
         WHERE idpelicula = ?`,
        [idpelicula, idpelicula, idpelicula]
    );
}

export function crearResena({ idpelicula, idusuario, titulo, comentarios, puntaje }) {
    return conTransaccion(async (connection) => {
        const [movies] = await connection.execute(
            "SELECT idpelicula FROM peliculas WHERE idpelicula = ? AND estado = 'aprobada' FOR UPDATE",
            [idpelicula]
        );
        if (!movies.length) {
            throw crearErrorHttp(404, 'Película aprobada no encontrada');
        }

        const [result] = await connection.execute(
            `INSERT INTO resenas (idpelicula, idusuario, titulo, comentarios, fechaResena, puntaje)
             VALUES (?, ?, ?, ?, CURDATE(), ?)`,
            [idpelicula, idusuario, titulo, comentarios, puntaje]
        );
        await recalcularPromedio(connection, idpelicula);
        return { id: result.insertId, mensaje: 'Reseña creada correctamente' };
    });
}

export function actualizarResena({ id, idusuario, role, titulo, comentarios, puntaje }) {
    return conTransaccion(async (connection) => {
        const [reviews] = await connection.execute(
            'SELECT idusuario, idpelicula FROM resenas WHERE id = ? FOR UPDATE',
            [id]
        );
        const review = reviews[0];
        if (!review) {
            throw crearErrorHttp(404, 'Reseña no encontrada');
        }
        if (review.idusuario !== idusuario && role !== 'administrador') {
            throw crearErrorHttp(403, 'Solo puedes modificar tus propias reseñas');
        }

        await connection.execute(
            'UPDATE resenas SET titulo = ?, comentarios = ?, puntaje = ? WHERE id = ?',
            [titulo, comentarios, puntaje, id]
        );
        await recalcularPromedio(connection, review.idpelicula);
        return { mensaje: 'Reseña actualizada correctamente' };
    });
}

export function eliminarResena({ id, idusuario, role }) {
    return conTransaccion(async (connection) => {
        const [reviews] = await connection.execute(
            'SELECT idusuario, idpelicula FROM resenas WHERE id = ? FOR UPDATE',
            [id]
        );
        const review = reviews[0];
        if (!review) {
            throw crearErrorHttp(404, 'Reseña no encontrada');
        }
        if (review.idusuario !== idusuario && role !== 'administrador') {
            throw crearErrorHttp(403, 'Solo puedes eliminar tus propias reseñas');
        }

        await connection.execute('DELETE FROM resenas WHERE id = ?', [id]);
        await recalcularPromedio(connection, review.idpelicula);
        return { mensaje: 'Reseña eliminada correctamente' };
    });
}

export function registrarVoto({ idresena, idusuario, voto }) {
    return conTransaccion(async (connection) => {
        const [reviews] = await connection.execute(
            'SELECT idusuario FROM resenas WHERE id = ? FOR UPDATE',
            [idresena]
        );
        const review = reviews[0];
        if (!review) {
            throw crearErrorHttp(404, 'Reseña no encontrada');
        }
        if (review.idusuario === idusuario) {
            throw crearErrorHttp(403, 'No puedes votar en tu propia reseña');
        }
        await connection.execute(
            `INSERT INTO resena_votos (idresena, idusuario, voto) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE voto = VALUES(voto), created_at = CURRENT_TIMESTAMP`,
            [idresena, idusuario, voto]
        );
        return { mensaje: 'Voto registrado correctamente', voto };
    });
}

export function eliminarVoto({ idresena, idusuario }) {
    return conTransaccion(async (connection) => {
        const [result] = await connection.execute(
            'DELETE FROM resena_votos WHERE idresena = ? AND idusuario = ?',
            [idresena, idusuario]
        );
        if (!result.affectedRows) {
            throw crearErrorHttp(404, 'No tienes un voto registrado en esta reseña');
        }
        return { mensaje: 'Voto eliminado correctamente' };
    });
}
