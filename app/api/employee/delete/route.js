import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const dbConfig = {
    host: process.env.NEXT_DB_HOST,
    user: process.env.NEXT_DB_USER,
    password: process.env.NEXT_DB_PASSWORD,
    database: process.env.NEXT_DB_NAME,
};

export async function POST(request) {
    const { id, ip_address, port } = await request.json(); // Get the employee ID from the request body

    const connectionResponse = await fetch(`${process.env.NEXT_PUBLIC_ZK_API_URL}/connection/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_address, port }),
    });

    if (!connectionResponse.ok) {
        return NextResponse.json({ error: 'Failed to connect to ZK Scanner' }, { status: 500 });
    }

    // Delete user via Flask API
    const addUserResponse = await fetch(`${process.env.NEXT_PUBLIC_ZK_API_URL}/delete_user`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
    });

    if (!addUserResponse.ok) {
        return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
    }


    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.query('DELETE FROM employees WHERE user_id = ?', [id]); // Delete employee by ID

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json({ message: 'Error deleting employee' }, { status: 500 });
    }
}