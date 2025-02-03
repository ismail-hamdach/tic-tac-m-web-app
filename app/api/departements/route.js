import { NextResponse } from 'next/server';
import { pool } from "@/provider/db.provider"


export async function GET(req) {
  try {
    const [rows] = await pool.query('SELECT id, department_name, created_at FROM departments'); // Adjust the query as needed
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ message: "Failed to fetch departments." }, { status: 500 });
  }
}

export async function POST(req) {
  const { name } = await req.json();
  const currentDate = new Date(); // Fetch the current timestamp
  try {
    const [result] = await pool.query('INSERT INTO departments (department_name) VALUES (?)', [name]);
    return NextResponse.json({ id: result.insertId, department_name: name, created_at: currentDate }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ message: "Failed to create department.", description: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, name } = await req.json();
  try {
    await pool.query('UPDATE departments SET department_name = ? WHERE id = ?', [name, id]);
    return NextResponse.json({ message: "Department updated successfully." });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ message: "Failed to update department." }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await pool.query('DELETE FROM departments WHERE id = ?', [id]);
    return NextResponse.json({ message: "Department deleted successfully." });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ message: "Failed to delete department." }, { status: 500 });
  }
}