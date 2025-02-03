import { NextResponse } from 'next/server';
import { pool } from "@/provider/db.provider"

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
