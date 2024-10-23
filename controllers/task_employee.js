import Employee from "../models/employee.js";
import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const { taskName, description, priority, dueDate, employeeId } = req.body;
  try {
    const employee = await Employee.findOne({employeeId});
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const newTask = await Task.create({
      taskName,
      description,
      priority,
      dueDate,
      employeeId,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};


// export const getTasksByEmployeeId = async (req, res) => {
//   const { employeeId } = req.body.id;
//   try {
//     const tasks = await Task.findAll({ where: { id } });
//     if (tasks.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No tasks found for this employee" });
//     }
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching tasks", error });
//   }
// };





export const getTasksByEmployeeId = async (req, res) => {
  const { id, usertype_name } = req.body; // Destructure employeeId and usertype_name

  let tasks;

  try {
    // Determine which task table to query based on usertype_name
    switch (usertype_name) {
      case "sales_person":
        tasks = await Task.findAll({ where: { id } });
        break;
      case "counselor":
        tasks = await Task_counselor.findAll({ where: { id } });
        break;
      case "employee":
        tasks = await Task.findAll({ where: { id } });
        break;
      default:
        return res.status(400).json({ message: "Invalid user type" });
    }

    // Send the tasks back to the client
    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({ message: "No tasks found for this employee" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message || error,
    });
  }
};




export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { taskName, description, priority, status, dueDate, employeeId } =
    req.body;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.update({
      taskName,
      description,
      priority,
      dueDate,
      status,
      employeeId,
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
