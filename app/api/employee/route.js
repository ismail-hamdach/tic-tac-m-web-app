import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    // Create a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: process.env.NEXT_DB_HOST,
      user: process.env.NEXT_DB_USER,
      password: process.env.NEXT_DB_PASSWORD,
      database: process.env.NEXT_DB_NAME,
    });

    // Execute the query to fetch all users
    const [rows] = await connection.execute('SELECT * FROM employees');

    // Close the database connection
    await connection.end();

    // Return the results as JSON
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
