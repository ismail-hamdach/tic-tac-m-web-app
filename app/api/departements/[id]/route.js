import { NextResponse } from 'next/server';

import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.NEXT_DB_HOST, // e.g., 'localhost'
  user: process.env.NEXT_DB_USER, // e.g., 'root'
  password: process.env.NEXT_DB_PASSWORD,
  database: process.env.NEXT_DB_NAME,
});

export async function GET(request, { params }) {
  const { id } = params;

  // Find the item by ID
  try {
    const [rows] = await pool.query(`SELECT id, department_name, created_at FROM departments WHERE id = ${id}`); // Adjust the query as needed
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json({ message: "Failed to fetch departments." }, { status: 500 });
  }
}
