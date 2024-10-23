import express from 'express';
import { createMeeting, deleteMeeting, getAllMeetings, getMeetingById, updateMeeting } from '../controllers/meeting.js';


const router = express.Router();

// Create a new meeting
router.post('/meetings/create', createMeeting);

// Get all meetings
router.get('/meetings/getall', getAllMeetings);

// Get a specific meeting by ID
router.get('/meetings/get/:id', getMeetingById);

// Update a meeting by ID
router.put('/meetings/update/:id', updateMeeting);

// Delete a meeting by ID
router.delete('/meetings/delete/:id', deleteMeeting);

export default router;
