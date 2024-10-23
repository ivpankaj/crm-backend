import express from 'express';
import {
  createWorkEmployee,
  getAllWorkEntries,
  getWorkEmployeeById,
  updateWorkEmployee,
  deleteWorkEmployee
} from '../controllers/workEmployeeController.js';

const router = express.Router();

// Route to create a new work entry for a specific employee
router.post('/work/employee/:employeeId/', createWorkEmployee);

// Route to get all work entries
router.get('/work/employee/getall/work', getAllWorkEntries);

// Route to get a specific work entry by ID
router.get('/work/employee/get/:workId', getWorkEmployeeById);

// Route to update a work entry
router.put('/work/employee/work/:workId', updateWorkEmployee);

// Route to delete a work entry
router.delete('/work/employee/work/:workId', deleteWorkEmployee);

export default router;
