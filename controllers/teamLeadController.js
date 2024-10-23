
// routes/leads.js

import Lead from '../models/LeadModel.js'; 
import Employee from '../models/employee.js';
import sequelize from '../config/database.js';
import Notes from '../models/NotesModel.js';

// Get all leads with their assigned employees
export const getAllEmployeesFromTeamLeadId = async (req, res) => {
  try {
    let id = req.body.id;

    // Fetch leads assigned to the given team lead ID
    const employee = await Employee.findAll({ where: { teamLeadId: id } });
   
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};




// Get leads assigned to a specific employee with optional filtering
export const getLeadsByEmployeeId = async (req, res) => {
  const { employeeId, status, startDate, endDate } = req.body;

  try {
    const whereConditions = { assignToSales_personId: employeeId };

    // Add filters based on status and date range
    if (status) {
      whereConditions.status = status;
    }

    if (startDate || endDate) {
      whereConditions.createdAt = {};
      if (startDate) {
        whereConditions.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereConditions.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const leads = await Lead.findAll({ where: whereConditions });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};




export const getAllStatusesForTeamLead = async (req, res) => {
  try {
    // Use Sequelize's findAll method to get unique statuses
    const statuses = await Lead.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('status')), 'status']
      ]
    });

    // Extract only the statuses into an array
    const uniqueStatuses = statuses.map(status => status.status);

    // Send the response
    res.status(200).json({
      success: true,
      data: uniqueStatuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statuses',
      error: error.message,
    });
  }
};








export const assignLeadsToEmployeeByTeamLead = async (req, res) => {
  const { employeeId, leadIds } = req.body;

  try {
    // Check if the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update leads to assign them to the employee
    const [updatedRowsCount] = await Lead.update(
      { assignToSales_personId: employeeId }, // Set the employeeId for leads
      {
        where: {
          id: leadIds, // Update only the leads in the leadIds array
        },
      }
    );

    // If no leads were updated, return a message
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'No leads found for the provided IDs' });
    }

    res.status(200).json({ message: 'Leads assigned successfully' });
  } catch (error) {
    console.error('Error assigning leads:', error);
    res.status(500).json({ message: 'Error assigning leads', error: error.message });
  }
};














export const GetAllLeadsAssignedToTeamLead = async (req, res) => {
  const { id } = req.body;
  try {
    // Fetch leads assigned to the specified team lead
    const leads = await Lead.findAll({ where: { teamleadId: id } });

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: 'No leads found for this team lead' });
    }

    // Create an array to hold the modified leads with owner details
    const leadsWithOwner = await Promise.all(leads.map(async (lead) => {
      // Find the employee using the assignToSales_personId
      const employee = await Employee.findOne({ where: { id: lead.assignToSales_personId } });
      
      // Get the employee name
      const leadOwner = employee ? employee.name : 'Unknown'; // Default to 'Unknown' if no employee found

      // Return the lead with the added leadOwner property
      return {
        ...lead.toJSON(), // Convert lead to plain object
        leadOwner, // Add the leadOwner property
      };
    }));

    res.status(200).json(leadsWithOwner);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};




//create lead by admin
// export const createLeadByTeamLeadAdmin = async (req, res) => {
//   try {
//     let id = req.body.id;
//     const data  = req.body;
//     console.log('backend data',req.body);
//     // Fetch leads assigned to the given team lead ID
//     const employee = await Employee.findAll({ where: { teamLeadId: id } });
//     if(employee){
//     const leadSaved = await Lead.create(data);
//     const notes = await Notes.create({notes : req.body.notes, leadId : leadSaved.id})
//     return res.status(201).send({message : 'lead created successfully',data : leadSaved,notes: notes})
//     }else{
//       return res.send({message: 'you are not authorized to create lead do contact with admin'})
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching leads', error: error.message });
//   }
// };



// export const createLeadByTeamLeadAdmin = async (req, res) => {
//   try {
//     const { note, ...data } = req.body;
//     let usertype_name = req.body.usertype_name
//     let id = req.body.id;
//     // Fetch leads assigned to the given team lead ID
//     const employees = await Employee.findAll({ where: { id: id , usertype_name : usertype_name} });
    
//     if (!employees.length) {
//       return res.status(403).send({ message: 'You are not authorized to create a lead. Please contact the admin.' });
//     }

//     // Create lead and notes
//     const leadSaved = await Lead.create({ ...data, teamLeadId: id });
//     const notesSaved = await Notes.create({ note ,leadId: leadSaved.id });

//     return res.status(201).send({ message: 'Lead created successfully', data: leadSaved, notes: notesSaved });
//   } catch (error) {
//     console.error("Error in lead creation:", error);
//     res.status(500).json({ message: 'Error creating lead', error: error.message });
//   }
// };



export const createLeadByTeamLeadAdmin = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    const {id, usertype_name, note, ...data } = req.body;

    // Validate required fields
    if (!id || !usertype_name) {
      return res.status(400).send({ message: 'ID and user type name are required.' });
    }

    // Fetch leads assigned to the given team lead ID
    const employees = await Employee.findAll({
      where: { usertype_name: usertype_name },
      transaction: t
    });

    if (!employees.length) {
      return res.status(404).send({ message: 'Employee not found. Please contact the admin.' });
    }

    // Create lead and notes
    const leadSaved = await Lead.create({ ...data, teamLeadId: id }, { transaction: t });
    const notesSaved = await Notes.create({ note, leadId: leadSaved.id }, { transaction: t });

    // Commit the transaction
    await t.commit();

    return res.status(201).send({ message: 'Lead created successfully', data: leadSaved, notes: notesSaved });
  } catch (error) {
    await t.rollback(); // Rollback the transaction on error
    console.error("Error in lead creation:", error);
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
};


