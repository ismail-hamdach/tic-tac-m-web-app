import mysql from 'mysql2/promise'; // Adjust the import based on your project structure
import { dbConfig } from "@/provider/db.provider"

// New endpoint to retrieve employees who completed 8 hours yesterday
export const dynamic = 'force-dynamic';


export async function POST(req) {


    const connection = await mysql.createConnection(dbConfig);

    const { start_time, end_time } = await req.json()

    const [rows] = await connection.execute(
        `
            SELECT 
                e.user_name AS name,
                d.department_name AS department,
                DATE(al.check_in) AS date,
                TIME(al.check_in) AS check_in,
                TIME(al.check_out) AS check_out,
                CASE 
                    WHEN al.check_in > sh.start_time THEN TIMESTAMPDIFF(MINUTE, sh.start_time, al.check_in)
                    ELSE 0
                END AS delay,
                CASE 
                    WHEN al.check_in IS NULL AND al.check_out IS NULL THEN 'Yes'
                    ELSE 'No'
                END AS absent,
                CASE 
                    WHEN s.rest_days = 1 THEN 'Yes'
                    ELSE 'No'
                END AS day_off,
                SUM(
                    CASE 
                        WHEN al.check_in > sh.start_time THEN TIMESTAMPDIFF(MINUTE, sh.start_time, al.check_in)
                        ELSE 0
                    END
                ) OVER (PARTITION BY e.user_id) AS total_hours_delay
            FROM 
                employees e
            LEFT JOIN 
                departments d ON e.departement_id = d.id
            LEFT JOIN 
                attendance_logs al ON e.user_id = al.user_id
            LEFT JOIN 
                schedules s ON e.user_id = s.employee_id
            LEFT JOIN 
                shifts sh ON s.shift_id = sh.shift_id
            WHERE 
                DATE(al.check_in) BETWEEN ? AND ? 
            ORDER BY 
                e.user_name, DATE(al.check_in);
    `,
        [start_time, end_time]
    );



    await connection.end();

    return new Response(JSON.stringify({
        data: rows
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
