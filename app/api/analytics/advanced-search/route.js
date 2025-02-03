import mysql from 'mysql2/promise'; // Adjust the import based on your project structure
import { dbConfig } from "@/provider/db.provider"

// New endpoint to retrieve employees who completed 8 hours yesterday
export const dynamic = 'force-dynamic';


export async function POST(req) {


    const connection = await mysql.createConnection(dbConfig);

    const { start_time, end_time } = await req.json()

    const [rows] = await connection.execute(
    `
        WITH RECURSIVE DateRange AS (
            -- Anchor member: Start with the initial date (x)
            SELECT 
                ? AS date -- Replace '2023-10-01' with your start date (x)
            UNION ALL
            -- Recursive member: Add 1 day to the previous date
            SELECT 
                DATE_ADD(date, INTERVAL 1 DAY)
            FROM 
                DateRange
            WHERE 
                date < ? -- Replace '2023-10-31' with your end date (y)
        ),
        EmployeeDates AS (
            -- Cross join the generated dates with the employees table
            SELECT 
                e.user_id, 
                e.user_name,
                dr.date
            FROM 
                DateRange dr
            CROSS JOIN 
                employees e
        )

        SELECT 
            ed.user_id, 
            ed.user_name, 
            d.department_name, 
            ed.date,
            a.check_in, 
            a.check_out, 
            sh.start_time, 
            sh.end_time, 
            CASE 
                WHEN a.check_in is NULL THEN 2
                WHEN TIME(a.check_in) <= TIME(sh.start_time) THEN 0
                ELSE 1
            END AS delay,
            
            CASE 
                WHEN a.check_in is NULL THEN 1
                ELSE 0
            END AS Absent,
            
            CASE
                WHEN a.check_in is NULL THEN 0
                ELSE 0
            END AS Day_off,

            CASE 
                WHEN a.check_in is NULL THEN NULL
                WHEN TIME(a.check_in) <= TIME(sh.start_time) THEN 0
                ELSE TIMESTAMPDIFF(MINUTE, sh.start_time, a.check_in)  
            END AS total_minutes_delay
        FROM 
            EmployeeDates ed
        LEFT JOIN 
            attendance_logs a 
            ON ed.user_id = a.user_id 
            AND ed.date = DATE(a.check_in)
        LEFT JOIN 
            schedules s 
            ON ed.user_id = s.employee_id
        LEFT JOIN 
            shifts sh 
            ON sh.shift_id = s.shift_id
        LEFT JOIN 
            departments d 
            ON d.id = sh.departement_id
        WHERE 
            ed.date BETWEEN ? AND ?
        ORDER BY 
            ed.user_id, ed.date;
    `,
        [start_time, end_time, start_time, end_time]
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
