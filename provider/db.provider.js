import mysql from 'mysql2/promise';

export const dbConfig = {
    host: process.env.NEXT_DB_HOST,
    user: process.env.NEXT_DB_USER,
    password: process.env.NEXT_DB_PASSWORD,
    database: process.env.NEXT_DB_NAME,
};

export const pool = mysql.createPool(dbConfig);


