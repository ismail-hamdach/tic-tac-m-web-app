import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET() {
  let connection;
  try {
    // Create a connection to the database
    connection = await mysql.createConnection(dbConfig);

    // Execute the query
    const [rows] = await connection.execute('SELECT check_in, check_out FROM attendance_checks');

    // Return the results
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
