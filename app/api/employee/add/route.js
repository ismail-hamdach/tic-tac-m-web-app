import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// MySQL connection configuration
const dbConfig = {
    host: process.env.NEXT_DB_HOST,
    user: process.env.NEXT_DB_USER,
    password: process.env.NEXT_DB_PASSWORD,
    database: process.env.NEXT_DB_NAME,
};

export async function POST(request) {
    try {
        const { userName, phoneNumber, ip_address, port } = await request.json();

        // Validation checks
        if (!userName || typeof userName !== 'string' || userName.trim() === '') {
            return NextResponse.json({ error: 'Invalid userName' }, { status: 400 });
        }
        if (!phoneNumber || typeof phoneNumber !== 'string' || !/^\d{10}$/.test(phoneNumber)) {
            return NextResponse.json({ error: 'Invalid phoneNumber' }, { status: 400 });
        }
        if (!ip_address || typeof ip_address !== 'string' || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip_address)) {
            return NextResponse.json({ error: 'Invalid ip address' }, { status: 400 });
        }
        if (!port || typeof port !== 'number' || port < 1 || port > 65535) {
            return NextResponse.json({ error: 'Invalid port' }, { status: 400 });
        }

        // Check connection with Flask API
        const connectionResponse = await fetch(`${process.env.NEXT_PUBLIC_ZK_API_URL}/connection/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip_address, port }),
        });

        if (!connectionResponse.ok) {
            return NextResponse.json({ error: 'Failed to connect to ZK Scanner' }, { status: 500 });
        }

        // Add user via Flask API
        const addUserResponse = await fetch(`${process.env.NEXT_PUBLIC_ZK_API_URL}/add_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: userName, 
                ip_address, 
                port
            }),
        });

        if (!addUserResponse.ok) {
            return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
        }

        const addUserResult = await addUserResponse.json();

        // Add user to MySQL database
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO employees (user_id, user_name, phone_number, privilege) VALUES (?, ?, ?, ?)',
            [addUserResult.data.user_id, userName, phoneNumber, addUserResult.data.privilege]
        );
        await connection.end();

        return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}