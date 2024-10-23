import express from 'express';
import { createNote, deleteNote, getAllNotes, getNoteById } from '../controllers/Notes.js';
import { verifyAdminToken } from '../config/authMiddleware.js';


const router = express.Router();

router.post('/admin/create/notes',verifyAdminToken, createNote);                  // Create a note
router.get('/admin/getall/notes',verifyAdminToken, getAllNotes);                   // Get all notes
router.get('/admin/get/notes/:id',verifyAdminToken, getNoteById);
                // Get a note by ID                // Update a note
router.delete('/admin/delete/:id',verifyAdminToken, deleteNote);              // Delete a note

export default router;