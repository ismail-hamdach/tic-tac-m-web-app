import { NextResponse } from 'next/server';
import { pool } from "@/provider/db.provider"


export async function GET(request) {

    // Find the item by ID
    try {
        const [rows] = await pool.query(`
            SELECT schedule_id, department_name, employee_id, user_name, s.created_at as created_at, shift_name, start_time, end_time, phone_number 
            FROM schedules s
            LEFT JOIN shifts sh ON sh.shift_id = s.shift_id
            LEFT JOIN employees e ON e.user_id = s.employee_id
            LEFT JOIN departments d ON d.id = e.departement_id
            ORDER BY s.created_at
        `); // Adjust the query as needed
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching department:', error);
        return NextResponse.json({ message: "Failed to fetch schedules." }, { status: 500 });
    }
}


export const POST = async (request) => {
    const { shiftId, employeeId } = await request.json()
    try {
        const [result] = await pool.query(`
          INSERT INTO schedules (employee_id, shift_id)
            VALUES
                (${employeeId}, ${shiftId})
            `);

        // Fetch the newly created schedule data
        const [newSchedule] = await pool.query(`
            SELECT schedule_id, department_name, employee_id, user_name, s.created_at, shift_name, start_time, end_time, phone_number 
            FROM schedules s
            LEFT JOIN shifts sh ON sh.shift_id = s.shift_id
            LEFT JOIN employees e ON e.user_id = s.employee_id
            LEFT JOIN departments d ON d.id = e.departement_id
            WHERE s.schedule_id = ${result.insertId}
            `);
        return NextResponse.json({ status: 200, schedule: newSchedule[0] }); // Return the new schedule data
    } catch (error) {
        console.error('Error creating shift:', error);
        return NextResponse.json({ message: "Failed to create shift.", description: error.message }, { status: 500 });
    }
}

export const DELETE = async (request) => {
    const { scheduleId } = await request.json();
    try {
        await pool.query(`
            DELETE FROM schedules WHERE schedule_id = ${scheduleId}
        `);
        return NextResponse.json({ status: 200, message: "Schedule deleted successfully." });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        return NextResponse.json({ message: "Failed to delete schedule.", description: error.message }, { status: 500 });
    }
}

export const PUT = async (request) => {
    const { scheduleId, shiftId, employeeId } = await request.json();
    try {
        await pool.query(`
            UPDATE schedules
            SET employee_id = ${employeeId}, shift_id = ${shiftId}
            WHERE schedule_id = ${scheduleId}
        `);
        return NextResponse.json({ status: 200, message: "Schedule updated successfully." });
    } catch (error) {
        console.error('Error updating schedule:', error);
        return NextResponse.json({ message: "Failed to update schedule.", description: error.message }, { status: 500 });
    }
}