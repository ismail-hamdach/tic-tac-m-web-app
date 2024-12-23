import { NextResponse } from 'next/server';

import mysql from 'mysql2/promise';
import { dbConfig } from "@/provider/db.provider"

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

export async function GET(request, { params }) {
  const { id } = params;

  // Find the item by ID
  try {
    const [rows] = await pool.query(`SELECT shift_id, concat(start_time, " - " ,end_time) shift FROM shifts s JOIN departments d ON d.id = s.departement_id WHERE departement_id = ${id}`); // Adjust the query as needed
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json({ message: "Failed to fetch departments." }, { status: 500 });
  }
}


export const POST = async () => {
  return NextResponse.json({ status: 200 })
}