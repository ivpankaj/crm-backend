

import Lead from "../models/LeadModel.js";
import Notes from "../models/NotesModel.js";



export const createNote = async (req, res) => {
    const { leadId, note } = req.body;

    try {
        // Check if the employee exists
        const employee = await Lead.findOne({id: leadId});
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Create the note if employee exists
        const newNote = await Notes.create({ leadId, note });
        return res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating note' });
    }
};

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.findAll();
        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching notes' });
    }
};

// Get a note by ID
// export const getNoteById = async (req, res) => {

//     const { id } = req.body;
//     try {
//         const note = await Notes.findAll({ where : { leadId :id}});
//         if (note) {
//             return res.status(200).json(note);
//         }
//         return res.status(404).json({ message: 'Note not found' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error fetching note' });
//     }
// };



export const getNoteById = async (req, res) => {
    // Extract id from request body
    const { id } = req.params;

    // Input validation
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    
    // Ensure id is of valid type (assuming id is a number)

    try {
        // Fetch the note using id, use findOne if fetching a single note
        const note = await Notes.findAll({ where: { leadId: id } });

        // Handle if note not found
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Return the found note
        return res.status(200).json(note);

    } catch (error) {
        // Log and handle any errors during the request
        console.error('Error fetching note:', error);

        // Handle specific database errors if needed (optional)
        if (error.name === 'SequelizeConnectionError') {
            return res.status(500).json({ message: 'Database connection error' });
        }

        // Default error response
        return res.status(500).json({ message: 'Error fetching note' });
    }
};




export const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Notes.destroy({ where: { id } });
        if (deleted) {
            return res.status(204).send();
        }
        return res.status(404).json({ message: 'Note not found' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting note' });
    }
};
export const getNotesByEmployeeId = async (req, res) => {
    const { leadId } = req.params; // Get employeeId from request parameters
 
    try {
        const notes = await Notes.findAll({ where: { leadId } }); // Fetch notes by employeeId
        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found for this employee.' });
        }
        return res.status(200).json(notes); // Return found notes
    } catch (error) {
        console.error('Error fetching notes:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};