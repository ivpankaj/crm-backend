import upload from "../middlewares/upload.js";
import Employee from "../models/employee.js";
import Work_employee from "../models/work_employee.js";

// Create a new work entry
export const createWorkEmployee = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    const { description, date } = req.body;
    const { employeeId } = req.params;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const workpic = req.file ? req.file.filename : null;

    try {
      const work = await Work_employee.create({
        employeeId,
        description,
        workpic,
        date,
      });
      res
        .status(201)
        .json({ message: "Work entry created successfully", work });
    } catch (error) {
      res.status(500).json({ error: "Failed to create work entry" });
    }
  });
};
export const getAllWorkEntries = async (req, res) => {
    try {
      const workEntries = await Work_employee.findAll();
      res.status(200).json(workEntries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch work entries' });
    }
  };


  // Get a single work entry by ID
export const getWorkEmployeeById = async (req, res) => {
    const { workId } = req.params;
    try {
      const work = await Work_employee.findByPk(workId);
      if (!work) {
        return res.status(404).json({ message: "Work entry not found" });
      }
      res.status(200).json(work);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work entry" });
    }
  };
  
  // Update a work entry by ID
  export const updateWorkEmployee = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
  
      const { description, date } = req.body;
      const { workId } = req.params;
      const workpic = req.file ? req.file.filename : null;
  
      try {
        const work = await Work_employee.findByPk(workId);
        if (!work) {
          return res.status(404).json({ message: "Work entry not found" });
        }
  
        await work.update({
          description,
          date,
          workpic: workpic || work.workpic, // Keep old workpic if not updated
        });
  
        res.status(200).json({ message: "Work entry updated successfully", work });
      } catch (error) {
        res.status(500).json({ error: "Failed to update work entry" });
      }
    });
  };
  
  // Delete a work entry by ID
  export const deleteWorkEmployee = async (req, res) => {
    const { workId } = req.params;
    try {
      const work = await Work_employee.findByPk(workId);
      if (!work) {
        return res.status(404).json({ message: "Work entry not found" });
      }
      await work.destroy();
      res.status(200).json({ message: "Work entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete work entry" });
    }
  };
  