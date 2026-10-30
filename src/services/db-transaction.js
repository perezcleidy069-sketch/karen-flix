import { pool } from '../config/db.js';

export async function conTransaccion(operation) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await operation(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export function crearErrorHttp(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
