import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

import { Op } from "sequelize";
import Product from "../models/product.js";
import Sales from "../models/Sales.js";
import Lead from "../models/LeadModel.js";
import sequelize from "../config/database.js";
import Employee from "../models/employee.js";

const saltRounds = 10;
const jwtSecret = process.env.SECRET_KEY;

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Name is required and must be a non-empty string." });
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Email is required and must be a non-empty string." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email format is invalid." });
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      return res
        .status(400)
        .json({
          error: "Password is required and must be a non-empty string.",
        });
    }
    const existingAdminByEmail = await Admin.findOne({ where: { email } });
    if (existingAdminByEmail) {
      return res.status(400).json({ error: "Email is already registered." });
    }
    if (contactNumber) {
      const existingAdminByContact = await Admin.findOne({
        where: { contactNumber },
      });
      if (existingAdminByContact) {
        return res
          .status(400)
          .json({ error: "Contact number is already registered." });
      }
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getAdmins = async (req, res) => {
  try {
    const Admins = await Admin.findAll();
    res.status(200).json(Admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const generateToken = (Admin) => {
  return jwt.sign({ id: Admin.id, email: Admin.email }, jwtSecret, {
    expiresIn: "48h",
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Email is required and must be a non-empty string." });
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      return res
        .status(400)
        .json({
          error: "Password is required and must be a non-empty string.",
        });
    }

    // Check if the admin exists
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare password with hashed password
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate a token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      "PANKAJ",
      { expiresIn: "48h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeesByUserType = async (req, res) => {
  const { userType } = req.query;

  try {
    let employees = [];

    // Fetch employees based on userType
    employees = await Employee.findAll({ where: { userType_name: userType } });
    if (employees.length > 0) {
      return res.json(employees);
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ error: "Error fetching employees", details: error.message });
  }
};

// export const getEmployeesWithAssignedLeads = async (req, res) => {
//   const { userType_name } = req.query; // Get user type from query parameters

//   try {
//     let employees;
//     // Fetch employees based on user type
//     employees = await Employee.findAll({
//       where: { userType_name: userType_name },
//     });
//     if (employees.length > 0) {
//       // Get the IDs of the filtered employees
//       const employeeIds = employees.map((employee) => employee.id);

//       // Fetch leads assigned to the selected employees
//       let leads;
//       if(userType_name === "team_lead"){
//         leads = await Lead.findAll({
//           where: {
//             teamLeadId: {
//               [Op.ne]: null,
//               [Op.in]: employeeIds, // Only fetch leads for filtered employees
//             },
//           },
//         });
//       }else{
//       leads = await Lead.findAll({
//         where: {
//           assignToSales_personId: {
//             [Op.ne]: null,
//             [Op.in]: employeeIds, // Only fetch leads for filtered employees
//           },
//         },
//       });
//     }

//       // Create a mapping of employee IDs to their assigned leads
//       const employeeLeadMap = {};

//       leads.forEach((lead) => {
//         const employeeId = lead.assignToSales_personId;
//         if (!employeeLeadMap[employeeId]) {
//           employeeLeadMap[employeeId] = [];
//         }
//         employeeLeadMap[employeeId].push(lead);
//       });

//       // Create a result set including employees and their assigned leads
//       const result = employees.map((employee) => ({
//         ...employee.toJSON(), // Convert Sequelize instance to plain object
//         assignedLeads: employeeLeadMap[employee.id] || [], // Add leads to employee
//       }));

//       res.json(result);
//     } else {
//       return res.status(400).json({ error: "Invalid user type" });
//     }
//   } catch (error) {
//     console.error("Error fetching employees with assigned leads:", error);
//     res
//       .status(500)
//       .json({ error: "Error fetching employees", details: error.message });
//   }
// };










// export const getEmployeesWithAssignedLeads = async (req, res) => {
//   const { userType_name } = req.query;

//   // Check if userType_name is provided
//   if (!userType_name) {
//     return res.status(400).json({ error: "userType_name is required" });
//   }

//   try {
//     // Fetch employees based on user type
//     const employees = await Employee.findAll({
//       where: { userType_name: userType_name },
//     });

//     if (employees.length > 0) {
//       const employeeIds = employees.map((employee) => employee.id);
//       console.log('employees id',employeeIds)
//       // Fetch leads based on user type
//       let leads;
//       if (userType_name === "team_lead") {
//         leads = await Lead.findAll({
//           where: {
//             teamLeadId: {
//               [Op.ne]: null,
//               [Op.in]: employeeIds,
//             },
//           },
//         });
//       } else {
//         leads = await Lead.findAll({
//           where: {
//             assignToSales_personId: {
//               [Op.ne]: null,
//               [Op.in]: employeeIds,
//             },
//           },
//         });
//       }

//       // Create a mapping of employee IDs to their assigned leads
//       const employeeLeadMap = {};
//       leads.forEach((lead) => {
//         const employeeId = lead.assignToSales_personId || lead.teamLeadId; // Ensure correct ID is used
//         if (!employeeLeadMap[employeeId]) {
//           employeeLeadMap[employeeId] = [];
//         }
//         employeeLeadMap[employeeId].push(lead);
//       });
      

//       // Create a result set including employees and their assigned leads
//       const result = employees.map((employee) => ({
//         ...employee.toJSON(),
//         assignedLeads: employeeLeadMap[employee.id] || [],
//       }));

//       return res.json(result);
//     } else {
//       return res.status(404).json({ error: "No employees found for the specified user type" });
//     }
//   } catch (error) {
//     console.error("Error fetching employees with assigned leads:", error);
//     return res.status(500).json({ error: "Error fetching employees", details: error.message });
//   }
// };










export const getEmployeesWithAssignedLeads = async (req, res) => {
  const { userType_name } = req.query;

  // Check if userType_name is provided
  if (!userType_name) {
    return res.status(400).json({ error: "userType_name is required" });
  }

  try {
    // Fetch employees based on user type
    const employees = await Employee.findAll({
      where: { userType_name: userType_name },
    });

    if (employees.length > 0) {
      const employeeIds = employees.map((employee) => employee.id);
      console.log('Employee IDs:', employeeIds);

      // Fetch leads based on user type
      let leads;
      if (userType_name === "team_lead") {
        leads = await Lead.findAll({
          where: {
            teamLeadId: {
              [Op.ne]: null,
              [Op.in]: employeeIds,
            },
          },
        });
      } else {
        leads = await Lead.findAll({
          where: {
            assignToSales_personId: {
              [Op.ne]: null,
              [Op.in]: employeeIds,
            },
          },
        });
      }

      // Create separate mappings for leads assigned by team leads and sales persons
      const employeeLeadMap = {
        salesAssigned: {},
        teamLeadsAssigned: {},
      };

      leads.forEach((lead) => {
        const salesPersonId = lead.assignToSales_personId;
        const teamLeadId = lead.teamLeadId;

        if (salesPersonId) {
          if (!employeeLeadMap.salesAssigned[salesPersonId]) {
            employeeLeadMap.salesAssigned[salesPersonId] = [];
          }
          employeeLeadMap.salesAssigned[salesPersonId].push(lead);
        }

        if (teamLeadId) {
          if (!employeeLeadMap.teamLeadsAssigned[teamLeadId]) {
            employeeLeadMap.teamLeadsAssigned[teamLeadId] = [];
          }
          employeeLeadMap.teamLeadsAssigned[teamLeadId].push(lead);
        }
      });

      // Create a result set including employees and their assigned leads
      const result = employees.map((employee) => {
        const assignedLeads = userType_name === "team_lead"
          ? employeeLeadMap.teamLeadsAssigned[employee.id] || []
          : employeeLeadMap.salesAssigned[employee.id] || [];

        return {
          ...employee.toJSON(),
          assignedLeads,
        };
      });

      return res.json(result);
    } else {
      return res.status(404).json({ error: "No employees found for the specified user type" });
    }
  } catch (error) {
    console.error("Error fetching employees with assigned leads:", error);
    return res.status(500).json({ error: "Error fetching employees", details: error.message });
  }
};






export const getAssignedLeads = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const leads = await Lead.findAll({
      where: { assignToSales_personId: employeeId },
    });
    res.json(leads);
  } catch (error) {
    console.error("Error fetching assigned leads:", error);
    res
      .status(500)
      .json({ error: "Error fetching leads", details: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    // Count total counselors
    const totalCounselors = await Employee.count({
      where: { usertype_name: "counselor" },
    });

    const totalSalesPerson = await Employee.count({
      where: { usertype_name: "sales_man" },
    });

    // Count total products
    const totalProducts = await Product.count();

    // Count total sales
    const totalSales = await Sales.sum("salesAmount");

    // Count total employees
    const totalEmployees = await Employee.count();

    // Count active users
    const activeUsers = await Employee.count({
      where: { isActive: true },
    });

    // Prepare the response object
    const dashboardData = {
      totalCounselors,
      totalProducts,
      totalSales: totalSales || 0, // Handle if no sales are present
      totalEmployees,
      activeUsers,
      totalSalesPerson,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res
      .status(500)
      .json({ error: "Error fetching dashboard data", details: error.message });
  }
};


export const getAllStatuses = async (req, res) => {
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

export const getAllSources = async (req, res) => {
  try {
    // Use Sequelize's findAll method to get unique sources
    const sources = await Lead.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('source')), 'source']
      ]
    });

    // Extract only the sources into an array
    const uniqueSources = sources.map(source => source.source);

    // Send the response
    res.status(200).json({
      success: true,
      data: uniqueSources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sources',
      error: error.message,
    });
  }
};












// Assign employees to a team lead
export const assignEmployeesToTeamLead = async (req, res) => {
  const { employeeIds, teamLeadId } = req.body;

  try {
    // Update each employee's teamLeaderId
    await Employee.update(
      { teamLeadId },
      { where: { id: employeeIds } }
    );

    res.json({ message: 'Employees assigned to team lead successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning employees', error: error.message });
  }
};



