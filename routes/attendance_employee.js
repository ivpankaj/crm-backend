import express from 'express';
import { getAttendanceById} from '../controllers/attendance_controller_employee.js'
import { verifyAllUserToken } from '../config/allUserMiddleware.js';


const router = express.Router();


router.get('/attendance/get',verifyAllUserToken, getAttendanceById);



export default router;
