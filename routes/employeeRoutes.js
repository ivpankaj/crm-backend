import express from 'express';
import { updateEmployee, loginEmployee, getEmployeeById,getProfilePic, getallassignleadstome, updateleadstatus} from '../controllers/employeeController.js';
import upload from '../config/multer.js';
import { verifyAllUserToken } from '../config/allUserMiddleware.js';

const router = express.Router();

router.put('/employee/update/:employeeId', upload.single('profilePicture'), updateEmployee);
router.post("/login", loginEmployee)
router.get('/employee/get',verifyAllUserToken, getEmployeeById);
router.get('/employee/get/profilepic/:employeeId', getProfilePic);
router.get('/employee/get/leads',verifyAllUserToken,getallassignleadstome)
router.put('/employee/leads/update',verifyAllUserToken,updateleadstatus)
export default router;