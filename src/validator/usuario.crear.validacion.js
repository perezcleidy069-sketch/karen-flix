import { createPool } from 'mysqly2/promise';

const pool = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    passwaord: process.env.DB_PASSWARD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connection: 10
})