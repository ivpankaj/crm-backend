import express from 'express';
import { assignEmployeesToTeamLead, createAdmin, getAdminById, getAdmins, getAllSources, getAllStatuses, getAssignedLeads, getDashboardData, getEmployeesByUserType, getEmployeesWithAssignedLeads, loginAdmin } from '../controllers/adminController.js';
import { verifyAdminToken } from '../config/authMiddleware.js';
import { AdminCreateEmployee, AdminDeleteEmployee, AdmindeleteEmployee, AdmingetAllEmployees, AdmingetAllEmployeesSalesManCounselor, AdmingetAllEmployeesTeamLead, AdmingetEmployeeById, AdminUpdateEmployee, Adminupdateleadstatus, getAssignedLeadstoemployee } from '../controllers/employeeController.js';
import { AdmincreateProduct, AdmindeleteProduct, AdmingetAllProducts, AdmingetProductById, AdminupdateProduct, createProduct } from '../controllers/product_controller.js';
import { uploadFile, AdminprocessFile, AdmingetAllLeads, AdminLeadsById, AdmindeleteLead, assignLeadsToEmployee, adminSelectedEmployeesLead } from '../controllers/LeadController.js';
import { createAttendance, getAllAttendances, getAttendanceByStatus } from '../controllers/attendance_controller_employee.js';
import { AdminassignLeadToSalesPerson, AdmincreateLead, AdminGetAllLeads, AdmingetLeadById, AdminupdateLead, AdmuindeleteLead } from '../controllers/lead.js';
import { createUserType, getAllUserTypes } from '../controllers/usertype.js';
import { myController } from '../controllers/extra_controller.js';


const router = express.Router();

router.post('/admin/create', createAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/getall',verifyAdminToken, getAdmins);
router.get('/admin/get/:adminId', getAdminById);

//upload excel file
//upload excel file
router.post('/admin/upload/lead', uploadFile, AdminprocessFile);
router.get('/admin/getAllLead',AdminGetAllLeads)
router.get('/admin/leads:id',AdminLeadsById)
router.delete('/admin/leads/:id',AdmindeleteLead)

//get all asignment lead
router.post('/admin/assignLeads',verifyAdminToken, assignLeadsToEmployee);
router.get('/admin/userTypes', getAllUserTypes);
router.get('/admin/employee/getByUserType/',getEmployeesByUserType)
router.get('/admin/employee/getWithAssignedLeads',getEmployeesWithAssignedLeads)
router.get('/admin/leads/assignedTo/:employeeId',getAssignedLeads)

//get selected empyeee data
router.post('/admin/leads/employee/leadcount',adminSelectedEmployeesLead);
//create user type
router.post("/admin/usertype/create", createUserType);
router.get('/admin/dashboard',verifyAdminToken, getDashboardData);

//employee
router.post('/admin/employee/create',verifyAdminToken,  AdminCreateEmployee);
router.get('/admin/employee/get/:employeeId', verifyAdminToken,AdmingetEmployeeById); 
router.get('/admin/employee/getall',verifyAdminToken,AdmingetAllEmployees)
router.get('/admin/employee/getallassignleads',verifyAdminToken,getAssignedLeadstoemployee)
router.delete('/admin/employee/delete/:employeeId',verifyAdminToken,AdmindeleteEmployee)

//products
router.post('/admin/products/create',verifyAdminToken,AdmincreateProduct);
router.get('/admin/products/getall',verifyAdminToken,AdmingetAllProducts);
router.get('/admin/products/get/:id',verifyAdminToken,AdmingetProductById);
router.put('/admin/products/update/:id', verifyAdminToken,AdminupdateProduct);
router.delete('/admin/products/delete/:id', verifyAdminToken,AdmindeleteProduct);
//attendance 
router.post('/admin/attendance/employee/create',verifyAdminToken, createAttendance);
router.get('/admin/attendance/employee/getall',verifyAdminToken, getAllAttendances);
router.get("/admin/attendance/employee/status/:status",verifyAdminToken,getAttendanceByStatus );

//admin update emploee
router.put('/admin/employee/update/:employeeId',AdminUpdateEmployee)
router.delete('/admin/employee/delete',AdminDeleteEmployee)

//leads
router.post('/admin/leads/create',verifyAdminToken, AdmincreateLead);
router.get('/admin/leads/getall', AdmingetAllLeads);
router.get('/admin/leads/get/:leadId',verifyAdminToken, AdmingetLeadById);
router.put('/admin/leads/update/:id',verifyAdminToken, AdminupdateLead);
router.delete('/admin/leads/delete/:id',verifyAdminToken, AdmuindeleteLead);
router.put('/admin/leads/assign',verifyAdminToken, AdminassignLeadToSalesPerson);
router.get('/admin/getallstatuses',getAllStatuses)
router.get('/admin/getallsources',getAllSources)
router.put('/admin/leads/update',verifyAdminToken,Adminupdateleadstatus)

//asing employee to team lead routes
router.post('/admin/assign-employees',assignEmployeesToTeamLead)
router.get('/admin/employee/getall-counselor-sales-man',verifyAdminToken,AdmingetAllEmployeesSalesManCounselor)
router.get('/admin/employee/teamlead/getall',verifyAdminToken,AdmingetAllEmployeesTeamLead)


// //14 october 
router.post('/admin/schedule',myController)

export default router;