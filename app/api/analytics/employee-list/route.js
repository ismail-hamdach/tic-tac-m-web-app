import mysql from 'mysql2/promise'; // Adjust the import based on your project structure
import { dbConfig } from "@/provider/db.provider"

// New endpoint to retrieve employees who completed 8 hours yesterday
export const dynamic = 'force-dynamic';


export async function GET(req) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = `${yesterday.toISOString().split('T')[0]} 00:00:00`;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const connection = await mysql.createConnection(dbConfig);

    const [employeesCompletedHours] = await connection.execute(
        `SELECT e.user_id, e.user_name, e.phone_number, TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) working_hours FROM employees e JOIN attendance_logs a ON e.user_id = a.user_id WHERE TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) >= 8 AND a.check_in >=?`,
        [startOfDay]
    );

    const [employeesNotCompletedHours] = await connection.execute(
        `SELECT e.user_id, e.user_name, e.phone_number, TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) working_hours FROM employees e JOIN attendance_logs a ON e.user_id = a.user_id WHERE TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) <= 8 AND a.check_in >=?`,
        [startOfDay]
    );

    const [averageHours] = await connection.execute(
        `SELECT e.user_id, e.user_name, e.phone_number, AVG(TIMESTAMPDIFF(HOUR, a.check_in, a.check_out)) AS working_hours FROM employees e JOIN attendance_logs a ON e.user_id = a.user_id WHERE a.check_in >=? GROUP BY e.user_id`,
        [sevenDaysAgo.toISOString().split('T')[0] + ' 00:00:00']
    );



    await connection.end();

    return new Response(JSON.stringify({
        employeesCompletedHours,
        employeesNotCompletedHours,
        averageHours
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
