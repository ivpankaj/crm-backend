import { Op } from "sequelize";
import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employee.js";

export const createAttendance = async (req, res) => {
  try {
    const { date, status, email } = req.body;
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const existingAttendance = await Attendance.findOne({
      where: {
        employeeId: employee.employeeId,
        date,
      },
    });
    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this date" });
  }
    const newAttendance = await Attendance.create({
      date,
      status,
      employeeId: employee.employeeId,
    });
    res.status(201).json(newAttendance);
  } catch (err) {
    res
      .status(500)
      .json({      
        message: "Error creating attendance record",
        error: err.message,
      });
  }
};
export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
    });
    if (attendances.length > 0) {
      res.status(200).json(attendances);
    } else {
      res.status(404).json({ message: "No attendance records found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error fetching attendance records",
      error: err.message,
    });
  }
};


// Update the getAttendanceById function
export const getAttendanceById = async (req, res) => {
  try {
    const { usertype_name, month, day } = req.body; // Destructure usertype_name, month, and day
    
    let attendance;
    const startDate = month ? new Date(new Date().getFullYear(), month, 1) : null;
    const endDate = month ? new Date(new Date().getFullYear(), month + 1, 0) : null;

    // Determine which attendance table to query based on usertype_name
    switch (usertype_name) {
      case "sales_person":
        attendance = await Attendance_sales_person.findAll({
          where: {
            ...(startDate && endDate && {
              date: {
                [Op.between]: [startDate, endDate],
              },
            }),
            ...(day && {
              [Op.and]: [
                { date: { [Op.gte]: new Date(startDate.getFullYear(), startDate.getMonth(), 1) } },
                { date: { [Op.lte]: new Date(startDate.getFullYear(), startDate.getMonth(), day) } }
              ]
            })
          },
        });
        break;
      case "counselor":
        attendance = await Attendance_counselor.findAll({
          where: {
            ...(startDate && endDate && {
              date: {
                [Op.between]: [startDate, endDate],
              },
            }),
            ...(day && {
              [Op.and]: [
                { date: { [Op.gte]: new Date(startDate.getFullYear(), startDate.getMonth(), 1) } },
                { date: { [Op.lte]: new Date(startDate.getFullYear(), startDate.getMonth(), day) } }
              ]
            })
          },
        });
        break;
      case "employee":
        attendance = await Attendance.findAll({
          where: {
            ...(startDate && endDate && {
              date: {
                [Op.between]: [startDate, endDate],
              },
            }),
            ...(day && {
              [Op.and]: [
                { date: { [Op.gte]: new Date(startDate.getFullYear(), startDate.getMonth(), 1) } },
                { date: { [Op.lte]: new Date(startDate.getFullYear(), startDate.getMonth(), day) } }
              ]
            })
          },
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // Send the attendance records back to the client
    if (attendance.length > 0) {
      res.status(200).json(attendance);
    } else {
      res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error fetching attendance record",
      error: err.message,
    });
  }
};




export const getAttendanceByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Validate the provided status
    if (!["Present", "Absent", "Half Day"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    // Get the start and end of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of the day (00:00)
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of the day (23:59)

    // Find employees by status and today's date range
    const employees = await Attendance.findAll({
      where: {
        status,
        date: {
          [Op.between]: [todayStart, todayEnd], // Compare between start and end of today
        },
      },
    });

    // Check if employees were found
    if (employees.length > 0) {
      res.status(200).json(employees);
    } else {
      res
        .status(404)
        .json({ message: `No employees found with status ${status} for today.` });
    }
  } catch (err) {
    // Handle any server errors
    res.status(500).json({
      message: `Error fetching employees for today.`,
      error: err.message,
    });
  }
};
