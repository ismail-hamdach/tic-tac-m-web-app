const mysql = require("mysql2/promise");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") }); // Absolute Path

(async () => {
    console.log("Connecting to DB : " + process.env.NEXT_DB_HOST)
    const db = mysql.createPool({
        host: process.env.NEXT_DB_HOST,
        user: process.env.NEXT_DB_USER,
        password: process.env.NEXT_DB_PASSWORD,
        database: process.env.NEXT_DB_NAME,
    });
    console.log("Connected successfully")
    try {
        console.log("Fetching logs data...")
        const [rows] = await db.query("SELECT * FROM attendance_logs a JOIN employees e ON e.user_id = a.user_id JOIN schedules s ON s.employee_id = e.user_id JOIN shifts sh ON sh.shift_id = s.shift_id WHERE check_out IS NULL AND TIMESTAMPDIFF(HOUR, check_in, NOW()) >= 14;");
        console.log("Logs data fetched successfully")
        if (rows.length > 0) {
            console.log(rows.length + " missing checkout data has found.")
            console.log("Logs data updating ...")
            for (const row of rows) {
                console.log("updating " + row.id);
                const startTime = new Date(`1970-01-01T${row.start_time}`); // Fixed start time
                const endTime = new Date(`1970-01-01T${row.end_time}`); // Fixed end time
                const nbrHours = (endTime - startTime) / (1000 * 60 * 60); // Calculate hours
                await db.query(
                    `UPDATE attendance_logs 
                    SET check_out = DATE_ADD(check_in, INTERVAL ${nbrHours} HOUR) 
                    WHERE id = ${row.id};`
                )
                console.log("Updated " + row.id);
            }
            console.log("Logs data updated successfully")
        } else {
            console.log("Nothing to update");
        }
    } catch (error) {
        console.error("Error checking condition:", error);
    } finally {
        console.log("Exit...")
        process.exit();
    }
})();
