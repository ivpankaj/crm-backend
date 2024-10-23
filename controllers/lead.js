
import Lead from '../models/LeadModel.js';

export const createLead = async (req, res) => {
    try {
      const { leadId, name, email, contactNumber, status, source, budget, address, notes, employeeId } = req.body;
      const Employee = await Employee.findOne({ where: { employeeId } });
      if (!Employee) {
        return res.status(400).json({ error: 'Sales person not found' });
      }
      const lead = await Lead.create({
        leadId,
        name,
        email,
        contactNumber,
        status,
        source,
        budget,
        address,
        notes,
       employeeId
      });
  
      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Error creating lead', details: error.message });
    }
  };
  export const AdmincreateLead = async (req, res) => {
    try {
      const { leadId, name, email, contactNumber, status, source, budget, address, notes, employeeId } = req.body;
      const Employee = await Employee.findOne({ where: { employeeId } });
      if (!Employee) {
        return res.status(400).json({ error: 'Sales person not found' });
      }
      const lead = await Lead.create({
        leadId,
        name,
        email,
        contactNumber,
        status,
        source,
        budget,
        address,
        notes,
        employeeId
      });
  
      res.status(201).json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Error creating lead', details: error.message });
    }
  };
export const getAllLeads = async (req, res) => {
  try {
    let id = req.body.id;
    let usertype_name = req.body.usertype_name
    let leads
     if(usertype_name === 'sales_man'){
      leads = await Lead.findAll({where : {assignToSales_personId: id}});
     }if(usertype_name == 'team_lead'){
      leads = await Lead.findAll({where : {teamLeadId : id}});
     }
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leads', details: error.message });
  }
};

export const AdminGetAllLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leads', details: error.message });
  }
};


export const getLeadById = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lead', details: error.message });
  }
};

export const AdmingetLeadById = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lead', details: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { name, email, contactNumber, status, source, budget, address, notes, sales_personId } = req.body;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await lead.update({
      name,
      email,
      contactNumber,
      status,
      source,
      budget,
      address,
      notes,
      sales_personId
    });

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Error updating lead', details: error.message });
  }
};

export const AdminupdateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { name, email, contactNumber, status, source, budget, address, notes, sales_personId } = req.body;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await lead.update({
      name,
      email,
      contactNumber,
      status,
      source,
      budget,
      address,
      notes,
      sales_personId
    });

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Error updating lead', details: error.message });
  }
};
export const AdmuindeleteLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await lead.destroy();
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting lead', details: error.message });
  }
};
export const deleteLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await lead.destroy();
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting lead', details: error.message });
  }
};
export const assignLeadToSalesPerson = async (req, res) => {
  try {
    const { leadId, newEmployeeId } = req.body;

    // Find the lead by leadId
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Find the new sales person by newEmployeeId
    const newEmployee = await Employee.findOne({ where: { sales_personId: newEmployeeId } });
    if (!newEmployee) {
      return res.status(400).json({ error: 'New sales person not found' });
    }

    // Update the lead's sales_personId to the new one
    await lead.update({ sales_personId: newEmployeeId });

    res.status(200).json({ message: 'Lead assigned to new sales person successfully', lead });
  } catch (error) {
    res.status(500).json({ error: 'Error assigning lead', details: error.message });
  }
};

export const AdminassignLeadToSalesPerson = async (req, res) => {
  try {
    const { leadId, newEmployeeId } = req.body;
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const newEmployee = await Employee.findOne({ where: { sales_personId: newEmployeeId } });
    if (!newEmployee) {
      return res.status(400).json({ error: 'New sales person not found' });
    }
    await lead.update({ sales_personId: newEmployeeId });

    res.status(200).json({ message: 'Lead assigned to new sales person successfully', lead });
  } catch (error) {
    res.status(500).json({ error: 'Error assigning lead', details: error.message });
  }
};