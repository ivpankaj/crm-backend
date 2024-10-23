import express from 'express';
import { createTask, deleteTask, getAllTasks,  getTasksByEmployeeId, updateTask } from '../controllers/task_employee.js';
import { verifyAllUserToken } from '../config/allUserMiddleware.js';

const router = express.Router();

router.post('/tasks/employee/create', createTask);

router.get('/tasks/employee/get',verifyAllUserToken, getTasksByEmployeeId);

router.get('/tasks/employee/getall', getAllTasks);

router.put('/tasks/employee/update/:id', updateTask);

router.delete('/tasks/employee/delete/:id', deleteTask);

export default router;
