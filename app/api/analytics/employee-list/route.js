import mysql from 'mysql2/promise'; // Adjust the import based on your project structure
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
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
        `SELECT e.user_id, e.user_name, e.phone_number, TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) working_hours FROM employees e JOIN attendance_logs a ON e.id = a.user_id WHERE TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) >= 8 AND a.check_in >=?`,
        [startOfDay]
    );

    const [employeesNotCompletedHours] = await connection.execute(
        `SELECT e.user_id, e.user_name, e.phone_number, TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) working_hours FROM employees e JOIN attendance_logs a ON e.id = a.user_id WHERE TIMESTAMPDIFF(HOUR, a.check_in, a.check_out) <= 8 AND a.check_in >=?`,
        [startOfDay]
    );

    const [averageHours] = await connection.execute(
        `SELECT e.user_id, e.user_name, e.phone_number, AVG(TIMESTAMPDIFF(HOUR, a.check_in, a.check_out)) AS working_hours FROM employees e JOIN attendance_logs a ON e.user_id = a.user_id WHERE a.check_in >=? GROUP BY e.id`,
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