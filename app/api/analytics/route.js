import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.NEXT_DB_HOST,
  user: process.env.NEXT_DB_USER,
  password: process.env.NEXT_DB_PASSWORD,
  database: process.env.NEXT_DB_NAME,
};

export const dynamic = 'force-dynamic';

export async function GET() {
  let connection;
  try {

    const headers = {
      'Access-Control-Allow-Origin': '*', // Allow all origins
      'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow specific methods
      'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
    };

    // Create a connection to the database
    connection = await mysql.createConnection(dbConfig);

    // Execute the query
    const today = new Date();
    const todayStartOfDay = new Date(today.setHours(0, 0, 0, 0));
    const [rows1] = await connection.execute(`SELECT check_in, check_out FROM attendance_checks where date >= ?`, [todayStartOfDay]);

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));


    // Execute the query to count employees who completed and did not complete 8 hours
    const [rows] = await connection.execute(`
      SELECT 
        COUNT(CASE WHEN TIMESTAMPDIFF(HOUR, check_in, check_out) >= 8 THEN 1 END) AS completed,
        COUNT(CASE WHEN TIMESTAMPDIFF(HOUR, check_in, check_out) < 8 THEN 1 END) AS not_completed
      FROM attendance_logs
      WHERE check_in >= ? AND check_out <= ?
    `, [startOfDay, endOfDay]);

    const [rows2] = await connection.execute('SELECT COUNT(*) as total_employees FROM `employees`')

    const [rows3] = await connection.execute('SELECT AVG(TIMESTAMPDIFF(HOUR, check_in, check_out)) AS average_hours FROM  attendance_logs WHERE  check_in >= NOW() - INTERVAL 7 DAY;')
    const [rows4] = await connection.execute('SELECT  AVG(TIMESTAMPDIFF(HOUR, check_in, check_out)) AS average_hours FROM    attendance_logs WHERE  check_in >= NOW() - INTERVAL 14 DAY AND check_in < NOW() - INTERVAL 7 DAY;')
    const [rows5] = await connection.execute("SELECT DATE_FORMAT(check_in, '%Y-%m') AS month, COUNT(*) AS completed_employees FROM  attendance_logs WHERE  TIMESTAMPDIFF(HOUR, check_in, check_out) >= 8 AND check_in >= NOW() - INTERVAL 9 MONTH GROUP BY  month ORDER BY  month;")
    const [rows6] = await connection.execute("SELECT DATE_FORMAT(check_in, '%Y-%m') AS month, COUNT(*) AS not_completed_employees FROM attendance_logs WHERE TIMESTAMPDIFF(HOUR, check_in, check_out) < 8 AND check_in >= NOW() - INTERVAL 9 MONTH GROUP BY month ORDER BY month;")
    const [averageWorkingHoursLastNineMonths] = await connection.execute(`
        SELECT 
          DATE_FORMAT(check_in, '%Y-%m') AS month, 
          AVG(TIMESTAMPDIFF(HOUR, check_in, check_out)) AS average_hours 
        FROM 
          attendance_logs 
        WHERE 
          check_in >= NOW() - INTERVAL 8 MONTH 
        GROUP BY 
          month 
        ORDER BY 
          month;
      `);

    // Return the results including all rows
    return NextResponse.json({
      data: {
        attendanceChecks: rows1[0],
        completedNotCompleted: rows[0],
        totalEmployees: rows2[0],
        averageHoursLastWeek: rows3[0],
        averageHoursLastTwoWeeks: rows4[0],
        completedEmployeesLastNineMonths: rows5,
        notCompletedEmployeesLastNineMonths: rows6,
        averageWorkingHoursLastNineMonths
      }
    }, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}