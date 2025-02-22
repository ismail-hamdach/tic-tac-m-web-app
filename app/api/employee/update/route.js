import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise'; // Ensure you have mysql2 installed

import { dbConfig } from "@/provider/db.provider"


export async function POST(request) {
  const { id, name, phoneNumber, departementName } = await request.json();


  try {
    const connection = await mysql.createConnection(dbConfig);

    // Update employee in the database
    const [result] = await connection.execute(
      'UPDATE employees SET user_name = ?, phone_number = ?, departement_id = ? WHERE user_id = ?',
      [name, phoneNumber, departementName, id]
    );


    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ message: 'Failed to update employee' }, { status: 500 });
  } finally {
    await connection.end();
  }
}