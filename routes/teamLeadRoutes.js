import express from 'express';
import { assignLeadsToEmployeeByTeamLead, createLeadByTeamLeadAdmin, getAllEmployeesFromTeamLeadId, GetAllLeadsAssignedToTeamLead, getAllStatusesForTeamLead, getLeadsByEmployeeId } from '../controllers/teamLeadController.js';
import { verifyAllUserToken } from '../config/allUserMiddleware.js';

const router = express.Router();

router.get('/team-lead/employees/getall',verifyAllUserToken,getAllEmployeesFromTeamLeadId)
router.post('/team-lead/employee/leads',verifyAllUserToken,getLeadsByEmployeeId)
router.get('/team-lead/employee/allstatus/lead',verifyAllUserToken,getAllStatusesForTeamLead)
router.post('/team-lead/leads/assign',verifyAllUserToken,assignLeadsToEmployeeByTeamLead)
router.get('/team-lead/get-all-leads',verifyAllUserToken,GetAllLeadsAssignedToTeamLead)

//create single lead by team_lead

router.post('/team-lead/lead/create',verifyAllUserToken,createLeadByTeamLeadAdmin)
export default router;