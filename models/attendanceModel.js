import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Employee from "./employee.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Half Day"),
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      afterCreate: async (attendance) => { 
        try {
          await Employee.increment("attendanceCount", {
            by: 1,
            where: { employeeId: attendance.employeeId },
          });
        } catch (error) {
          console.error("Error updating attendance count:", error);
        }
      },
    },
  }
);

Employee.hasMany(Attendance, {
  foreignKey: "employeeId",
  as: "attendances",
});

Attendance.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
});

// Sync the updated model
Attendance.sync({ alter: true })
  .then(() => console.log("Attendance table updated")) 
  .catch((err) => console.log("Error in attendance table " + err));

export default Attendance;
