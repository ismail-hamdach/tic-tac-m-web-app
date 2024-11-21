import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.NEXT_DB_HOST, // e.g., 'localhost'
  user: process.env.NEXT_DB_USER, // e.g., 'root'
  password: process.env.NEXT_DB_PASSWORD,
  database: process.env.NEXT_DB_NAME,
});

export async function GET(req) {
  try {
    const [rows] = await pool.query(`
      SELECT
          shift_id,
          shift_name,
          start_time,
          end_time,
          shift_created_at,
          department_name,
          s.departement_id as department_id
      FROM
          shifts s
      LEFT JOIN departments d ON
          s.departement_id = d.id;
      `); // Adjusted query for shifts
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ message: "Failed to fetch shifts." }, { status: 500 });
  }
}

export async function POST(req) {
  const { shift_name, start_time, end_time, departement_id } = await req.json();
  const currentDate = new Date(); // Fetch the current timestamp
  try {
    const [result] = await pool.query(`
      INSERT INTO shifts(
          shift_name,
          start_time,
          end_time,
          departement_id
      )
      VALUES(?,  ?, ?, ?)
      `, [
      shift_name,
      start_time,
      end_time,
      departement_id
    ]);

    // Retrieve department_name using department_id
    const [departmentRows] = await pool.query(`
      SELECT department_name FROM departments WHERE id = ?
    `, [departement_id]);
    const department_name = departmentRows.length > 0 ? departmentRows[0].department_name : null;

    return NextResponse.json({
      shift_id: result.insertId,
      shift_name,
      start_time,
      end_time,
      shift_created_at: currentDate,
      departement_id,
      department_name
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ message: "Failed to create shift.", description: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { shift_id, shift_name, start_time, end_time, departement_id } = await req.json();
  try {
    await pool.query(`
      UPDATE
          shifts
      SET
          shift_name = ?,
          start_time = ?,
          end_time = ?,
          departement_id = ?
      WHERE
          shift_id = ?
      `, [
      shift_name,
      start_time,
      end_time,
      departement_id,
      shift_id
    ]);

    const [rows] = await pool.query(`
      SELECT
          shift_id,
          shift_name,
          start_time,
          end_time,
          shift_created_at,
          department_name,
          s.departement_id as department_id
      FROM
          shifts s
      LEFT JOIN departments d ON
          s.departement_id = d.id
      WHERE 
          shift_id = ?
      `, [shift_id,]); // Adjusted query for shifts

    return NextResponse.json({ message: "Shift updated successfully.", shift: rows[0] });
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json({ message: "Failed to update shift." }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { shift_id } = await req.json();
  try {
    await pool.query('DELETE FROM shifts WHERE shift_id = ?', [shift_id]);
    return NextResponse.json({ message: "Shift deleted successfully." });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ message: "Failed to delete shift." }, { status: 500 });
  }
}