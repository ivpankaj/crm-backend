import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";
import Employee from "../models/employee.js";
import Lead from "../models/LeadModel.js";

export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNumber,
      jobTitle,
      department,
      hireDate,
      salary,
      address,
      password,
      employeeId,
      usertype_name,
    } = req.body;

    if (password.length <= 6) {
      return res
        .status(400)
        .send({ message: "password must be 7 digit and greater" });
    }

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({
        message: "Name, email, employeeId, and password are required.",
      });
    }
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [{ email }, { contactNumber }, { employeeId }],
      },
    });
    if (existingEmployee) {
      return res.status(400).json({
        message:
          "Employee with this email, contact number, or employeeId already exists.",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newEmployee = await Employee.create({
      name,
      email,
      contactNumber,
      jobTitle,
      department,
      hireDate,
      salary,
      address,
      password: hashedPassword,
      employeeId,
      usertype_name,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error });
  }
};

export const AdminCreateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNumber,
      jobTitle,
      department,
      hireDate,
      salary,
      address,
      password,
      employeeId,
      usertype_name,
    } = req.body;

    // Check if usertype_name is provided
    if (!usertype_name) {
      return res.status(400).send({ message: "User type must be selected." });
    }

    // Check password length
    if (password.length <= 6) {
      return res
        .status(400)
        .send({ message: "Password must be at least 7 characters long." });
    }

    // Check required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    // Check for existing employee
    // Check for existing employee
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [{ email }, { contactNumber }, { employeeId }],
      },
    });

    if (existingEmployee) {
      const duplicateField =
        existingEmployee.email === email
          ? "email"
          : existingEmployee.contactNumber === contactNumber
          ? "contact number"
          : existingEmployee.employeeId === employeeId
          ? "employee ID"
          : null;

      return res.status(400).json({
        message: `Employee with this ${duplicateField} already exists.`,
      });
    }

    // Hash the password and create the new employee
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newEmployee = await Employee.create({
      name,
      email,
      contactNumber,
      jobTitle,
      department,
      hireDate,
      salary,
      address,
      password: hashedPassword,
      employeeId,
      usertype_name,
    });

    // Return success response
    res
      .status(201)
      .json({
        data: newEmployee,
        message: "Employee created successfully",
        status: 200,
      });
  } catch (error) {
    console.error("Error creating employee:", error);
    res
      .status(500)
      .json({ message: "Error creating employee", error: error.message });
  }
};

export const getProfilePic = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ where: { employeeId } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const { profilePicture } = employee;
    if (!profilePicture) {
      return res.status(404).json({ message: "Profile picture not found" });
    }
    res.status(200).json({ profilePicture });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { password } = req.body;
    const employee = await Employee.findOne({ where: { employeeId } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    let updatedPassword = employee.password;
    if (password) {
      const saltRounds = 10;
      updatedPassword = await bcrypt.hash(password, saltRounds);
    }
    let profilePicture = employee.profilePicture;
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }
    await employee.update({
      password: updatedPassword,
      profilePicture,
    });
    res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};
export const AdmindeleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const deleted = await Employee.destroy({
      where: { employeeId },
    });
    if (deleted) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password, usertype_name } = req.body;
    console.log(email, password, usertype_name);
    if (!usertype_name) {
      return res.status(400).json({ message: "User type is required" });
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    let employee;
      employee = await Employee.findOne({
        where: {
          email: Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("email")),
            "LIKE",
            email.toLowerCase()
          ),
          usertype_name: usertype_name,
        },
      });
  
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        usertype_name: employee.usertype_name,
      },
      "PANKAJ",
    );
    res.status(200).json({
      message: "Login successful",
      token,
      name:employee.name
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const AdmingetAllEmployees = async (req, res) => {
  const { usertype_name, search } = req.query;

  try {
    const where = {};
    if (usertype_name) {
      where.usertype_name = usertype_name;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { contactNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    const employees = await Employee.findAll({ where });
    res.status(200).json(employees);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving employees", error });
  }
};




export const AdmingetAllEmployeesSalesManCounselor = async (req, res) => {
  const { search } = req.query;

  try {
    const where = {
      [Op.or]: [
        { usertype_name: 'sales_man' },
        { usertype_name: 'counselor' },
      ],
    };

    if (search) {
      where[Op.and] = [
        { 
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { contactNumber: { [Op.like]: `%${search}%` } },
          ],
        },
        where[Op.or],
      ];
    }

    const employees = await Employee.findAll({ where });
    res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving employees", error });
  }
};




export const AdmingetAllEmployeesTeamLead = async (req, res) => {
  const { search } = req.query;

  try {
    const where = {
      [Op.or]: [
        { usertype_name: 'team_lead' },
      ],
    };

    if (search) {
      where[Op.and] = [
        { 
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { contactNumber: { [Op.like]: `%${search}%` } },
          ],
        },
        where[Op.or],
      ];
    }

    const employees = await Employee.findAll({ where });
    res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving employees", error });
  }
};

export const getAssignedLeadstoemployee = async (req, res) => {
  try {
    // Query to extract the specific fields from the Lead model
    const assignedLeads = await Lead.findAll({
      attributes: ['assignToSales_personId', 'teamLeadId'],
      where: {
        // You can add filtering conditions here if necessary
        isActive: true, // Example: Get only active leads
      },
    });

    // Send the result as the response
    return res.status(200).json({
      success: true,
      data: assignedLeads,
    });
  } catch (error) {
    console.error("Error fetching assigned leads: ", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching assigned leads",
    });
  }
};
// Update Employee API
export const AdminUpdateEmployee = async (req, res) => {
  const formData = req.body;
  const { employeeId } = req.params;
  console.log("all updates", formData);
  console.log("adl", req.body.address);
  try {
    const [updated] = await Employee.update(formData, {
      where: { employeeId },
    });
    if (updated) {
      const updatedEmployee = await Employee.findOne({ where: { employeeId } });
      return res.status(200).json(updatedEmployee);
    }
    throw new Error("Employee not found");
  } catch (error) {
    return res.status(500).json({ message: "Error updating employee", error });
  }
};

// Delete Employee API
export const AdminDeleteEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const deleted = await Employee.destroy({ where: { employeeId } });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error("Employee not found");
  } catch (error) {
    return res.status(500).json({ message: "Error deleting employee", error });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const employee = await Employee.findByPk(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found", id });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee", error });
  }
};
export const AdmingetEmployeeById = async (req, res) => {
  try {
    const id = req.params.employeeId;
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const employee = await Employee.findOne({ employeeId: id });
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found", id });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee", error });
  }
};




// //pankaj
// export const getallassignleadstome = async (req, res) => {
//   try {
//     const { id } = req.body; // Employee ID from the request body
//     if (!id) {
//       return res.status(400).json({ message: "Employee ID is required" });
//     }

//     const employee = await Employee.findByPk(id); // Fetch the employee by ID
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found", id });
//     }

//     // Assuming 'assignToSales_personId' is the correct field to filter leads
//     const leads = await Lead.findAll({ where: { assignToSales_personId: id } });
    
//     // Send the found leads in the response
//     res.status(200).json(leads);
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ message: "Internal server error" }); // Return a server error response
//   }
// };






export  const getallassignleadstome = async (req, res) => {
  try {
    let id = req.body.id;
    let userType_name = req.body.usertype_name;
    const { dateFrom, dateTo, status, source } = req.query; // Get filters from query
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found", id });
    }
    const whereClause = {};

    if(userType_name === "team_lead"){
       whereClause.teamLeadId = id;
    }else{
      whereClause.assignToSales_personId= id
    }

    if (dateFrom && dateTo) {
      whereClause.createdAt = {
        [Op.between]: [new Date(dateFrom), new Date(dateTo)],
      };
    }

    if (status) {
      whereClause.status = status;
    }

    if (source) {
      whereClause.source = source;
    }
   console.log('where clause',whereClause)
    const leads = await Lead.findAll({ where: whereClause });

    res.status(200).json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateleadstatus = async (req, res) => {
  try {
    const { Leadid, status } = req.body;

    // Validate input
    console.log(Leadid,status)
    if (!Leadid || !status) {
      return res.status(400).json({ error: 'ID and status are required.' });
    }

    const lead = await Lead.findOne({ where : {id :Leadid}});
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found yuytytdytryt' });
    }

    // Update the status
    lead.status = status;
    await lead.save();

    res.json({ message: 'Lead status updated successfully', lead });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      error: 'Error updating lead status',
      details: error.message,
    });
  }
};

export const Adminupdateleadstatus = async (req, res) => {
  try {
    const { Leadid, status } = req.body;

    // Validate input
    console.log(Leadid,status)
    if (!Leadid || !status) {
      return res.status(400).json({ error: 'ID and status are required.' });
    }

    const lead = await Lead.findOne({ where : {id :Leadid}});
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found yuytytdytryt' });
    }

    // Update the status
    lead.status = status;
    await lead.save();

    res.json({ message: 'Lead status updated successfully', lead });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      error: 'Error updating lead status',
      details: error.message,
    });
  }
};