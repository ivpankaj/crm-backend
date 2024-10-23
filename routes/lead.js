// routes/leadRoutes.js
import express from 'express';
import { assignLeadToSalesPerson, createLead, deleteLead, getAllLeads, getLeadById, updateLead } from '../controllers/lead.js';
import { verifyAllUserToken } from '../config/allUserMiddleware.js';

const router = express.Router();
router.post('/leads/create', createLead);
router.get('/leads/getall',verifyAllUserToken, getAllLeads);
router.get('/leads/get/:leadId', getLeadById);
router.put('/leads/update/:id', updateLead);
router.delete('/leads/delete/:id', deleteLead);
router.put('/leads/assign', assignLeadToSalesPerson);

export default router;