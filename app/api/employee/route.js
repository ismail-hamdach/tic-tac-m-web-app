import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { dbConfig } from "@/provider/db.provider"

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    // Create a connection to the MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Execute the query to fetch all users with their departments
    const [rows] = await connection.execute(`
        SELECT
            
            e.user_id,
            e.user_name,
            e.phone_number,
            e.created_at,
            e.departement_id,
            d.department_name
        FROM
            employees e
        LEFT JOIN departments d ON
            e.departement_id = d.id;
    `);

    // Close the database connection
    await connection.end();

    // Return the results as JSON
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
