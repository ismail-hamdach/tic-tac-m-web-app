import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise'; // Ensure you have mysql2 installed

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export async function POST(request) {
  const { id, name, phoneNumber } = await request.json();

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Update employee in the database
    const [result] = await connection.execute(
      'UPDATE employees SET user_name = ?, phone_number = ? WHERE user_id = ?',
      [name, phoneNumber, id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ message: 'Failed to update employee' }, { status: 500 });
  }
}