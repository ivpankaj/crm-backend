// controllers/LeadController.js
import Lead from "../models/LeadModel.js";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import upload from "../config/multer.js";
import Employee from "../models/employee.js";
import { Op } from "sequelize";

// Function to get the current directory name
const __dirname = path.resolve();

export const uploadFile = upload.single("file");

export const AdminprocessFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "./uploads/", req.file.filename);

  try {
    let jsonData;
    const errors = []; // Array to hold any validation errors
    const duplicates = []; // Array to hold duplicate entries

    // Process file based on its extension
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt === ".xlsx" || fileExt === ".xls") {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (fileExt === ".csv") {
      const csvData = fs.readFileSync(filePath, "utf8");
      const rows = csvData.split("\n").map((row) => row.split(","));
      const headers = rows[0];
      jsonData = rows.slice(1).map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = row[index] ? row[index].trim() : "";
        });
        return obj;
      });
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Validate required fields and check for duplicates
    const existingLeads = await Lead.findAll({
      attributes: ["email", "contactNumber"],
    });

    const existingMap = new Map(
      existingLeads.map((lead) => [lead.email, lead.contactNumber])
    );

    const mandatoryKeys = ["name", "email", "contactNumber", "source"];
    const optionalKeys = [
      "status",
      "budget",
      "address",
      "assignTo",
      "sales_personId",
      "notes",
      "isActive",
    ];

    jsonData.forEach((item, index) => {
      const errorsForRow = [];
      const itemToStore = {}; // Object to store validated fields

      // Check for mandatory fields
      mandatoryKeys.forEach((key) => {
        const value = item[key];
        if (key === "contactNumber") {
          // Convert contactNumber to string and trim
          itemToStore[key] =
            typeof value === "number" ? String(value).trim() : "";
        } else {
          itemToStore[key] = typeof value === "string" ? value.trim() : "";
        }

        if (!itemToStore[key]) {
          errorsForRow.push(`${key} is required`);
        }
      });

      // Validate contact number
      if (
        itemToStore.contactNumber &&
        !/^\d{10}$/.test(itemToStore.contactNumber)
      ) {
        errorsForRow.push("contactNumber should be a 10-digit number");
      }

      // Check for duplicates
      if (
        existingMap.has(itemToStore.email) &&
        Array.from(existingMap.values()).includes(itemToStore.contactNumber)
      ) {
        duplicates.push({
          line: index + 2,
          email: itemToStore.email,
          contactNumber: itemToStore.contactNumber,
        });
      }

      // If there are errors for this row, add to errors
      if (errorsForRow.length > 0) {
        errors.push({
          line: index + 2,
          missing: errorsForRow.join(", "),
        });
      } else {
        // Include any additional keys in the item to store
        Object.keys(item).forEach((key) => {
          if (mandatoryKeys.includes(key) || optionalKeys.includes(key)) {
            itemToStore[key] = item[key]; // Include validated and optional fields
          }
        });
        // Add the item to store to jsonData
        jsonData[index] = itemToStore; // Replace original with validated item
      }
    });

    // If there are validation or duplicate errors, respond with them
    if (errors.length > 0 || duplicates.length > 0) {
      return res.status(400).json({
        message: "Validation errors",
        errors,
        duplicates: duplicates.length > 0 ? duplicates : undefined,
      });
    }
    await Lead.bulkCreate(jsonData);
    fs.unlinkSync(filePath);

    res.json({
      message: "File processed and data stored successfully",
      data: jsonData,
    });
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({
        message: "Error processing file",
        error: error.message || error,
      });
  }
};


// export const AdmingetAllLeads = async (req, res) => {
//   try {
//     const { dateFrom, dateTo, status, source } = req.query;

//     // Initialize the where clause
//     const whereClause = {};

//     // Flag to determine if any filters are applied
//     let hasFilters = false;

//     // Validate and add date range filter if both dates are provided
//     if (dateFrom && dateTo) {
//       const startDate = new Date(dateFrom);
//       const endDate = new Date(dateTo);

//       // Ensure the date range is valid
//       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         return res.status(400).json({ message: "Invalid date format" });
//       }

//       whereClause.createdAt = {
//         [Op.between]: [startDate, endDate],
//       };
//       hasFilters = true;
//     }

//     // Add status filter if provided
//     if (status) {
//       whereClause.status = status;
//       hasFilters = true;
//     }

//     // Add source filter if provided
//     if (source) {
//       whereClause.source = source;
//       hasFilters = true;
//     }

//     // Log the where clause for debugging
//     console.log("Where Clause:", whereClause);

//     // If no filters are applied, return all leads
//     const leads = hasFilters
//       ? await Lead.findAll({ where: whereClause })
//       : await Lead.findAll(); // Fetch all leads

//     // Respond with the retrieved leads
//     res.json({ message: "Leads retrieved successfully", data: leads });
//   } catch (error) {
//     console.error("Error retrieving leads:", error);
//     res
//       .status(500)
//       .json({
//         message: "Error retrieving leads",
//         error: error.message || "An unexpected error occurred",
//       });
//   }
// };








// export const AdmingetAllLeads = async (req, res) => {
//   try {
//     const { dateFrom, dateTo, status, source ,leadType} = req.query;

//     // Initialize the where clause
//     const whereClause = {};
//     let hasFilters = false;

//     // Validate and add date range filter if both dates are provided
//     if (dateFrom && dateTo) {
//       const startDate = new Date(dateFrom);
//       const endDate = new Date(dateTo);

//       // Ensure the date range is valid
//       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         return res.status(400).json({ message: "Invalid date format" });
//       }

//       whereClause.createdAt = {
//         [Op.between]: [startDate, endDate],
//       };
//       hasFilters = true;
//     }

//     // Add status filter if provided
//     if (status) {
//       whereClause.status = status;
//       hasFilters = true;
//     }

//     // Add source filter if provided
//     if (source) {
//       whereClause.source = source;
//       hasFilters = true;
//     }

//     // Log the where clause for debugging
//     console.log("Where Clause:", whereClause);

//     // Fetch leads based on filters
//     const leads = await Lead.findAll({
//       where: hasFilters ? whereClause : undefined, // Only apply filters if any
//     });

//     if (!leads || leads.length === 0) {
//       return res.status(404).json({ message: 'No leads found' });
//     }

//     // Create an array to hold the modified leads with owner and team lead details
//     const leadsWithDetails = await Promise.all(leads.map(async (lead) => {
//       // Initialize names to 'Unknown'
//       let salesPersonName = 'Unknown';
//       let teamLeadName = 'Unknown';

//       // Check if assignToSales_personId exists before querying
//       if (lead.assignToSales_personId) {
//         const salesPerson = await Employee.findOne({ where: { id: lead.assignToSales_personId } });
//         if (salesPerson) {
//           salesPersonName = salesPerson.name;
//         }
//       }

//       // Check if teamleadId exists before querying
//       if (lead.teamLeadId) {
//         const teamLead = await Employee.findOne({ where: { id: lead.teamLeadId } });
//         if (teamLead) {
//           teamLeadName = teamLead.name;
//         }
//       }

//       // Return the lead with the added details
//       return {
//         ...lead.toJSON(), // Convert lead to plain object
//         salesPersonName, // Add the sales person's name
//         teamLeadName, // Add the team lead's name
//       };
//     }));

//     res.status(200).json({ message: "Leads retrieved successfully", data: leadsWithDetails });
//   } catch (error) {
//     console.error("Error retrieving leads:", error);
//     res.status(500).json({
//       message: "Error retrieving leads",
//       error: error.message || "An unexpected error occurred",
//     });
//   }
// };



export const AdmingetAllLeads = async (req, res) => {
  try {
    const { dateFrom, dateTo, status, source, leadType } = req.query;

    // Initialize the where clause
    const whereClause = {};
    let hasFilters = false;

    // Validate and add date range filter if both dates are provided
    if (dateFrom && dateTo) {
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);

      // Ensure the date range is valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
      hasFilters = true;
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
      hasFilters = true;
    }

    // Add source filter if provided
    if (source) {
      whereClause.source = source;
      hasFilters = true;
    }

    // Handle leadType filtering
    if (leadType) {
      switch (leadType) {
        case "All Unassigned":
          // All Unassigned: teamLeadId and assignToSales_personId are null
          whereClause.teamLeadId = null;
          whereClause.assignToSales_personId = null;
          break;
        case "all team Lead assigned":
          // All Team Lead Assigned: only teamLeadId is not null
          whereClause.teamLeadId = { [Op.ne]: null };
          whereClause.assignToSales_personId = null;
          break;
        case "all sales man assigned":
          // All Sales Person Assigned: only assignToSales_personId is not null
          whereClause.teamLeadId = null;
          whereClause.assignToSales_personId = { [Op.ne]: null };
          break;
        case "Both Assigned":
          // Both Assigned: both teamLeadId and assignToSales_personId are not null
          whereClause.teamLeadId = { [Op.ne]: null };
          whereClause.assignToSales_personId = { [Op.ne]: null };
          break;
        default:
          break;
      }
      hasFilters = true;
    }

    // Log the where clause for debugging
    console.log("Where Clause:", whereClause);

    // Fetch leads based on filters
    const leads = await Lead.findAll({
      where: hasFilters ? whereClause : undefined, // Only apply filters if any
    });

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: 'No leads found',data : [] });
    }

    // Create an array to hold the modified leads with owner and team lead details
    const leadsWithDetails = await Promise.all(leads.map(async (lead) => {
      // Initialize names to 'Unknown'
      let salesPersonName = 'Unknown';
      let teamLeadName = 'Unknown';

      // Check if assignToSales_personId exists before querying
      if (lead.assignToSales_personId) {
        const salesPerson = await Employee.findOne({ where: { id: lead.assignToSales_personId } });
        if (salesPerson) {
          salesPersonName = salesPerson.name;
        }
      }

      // Check if teamLeadId exists before querying
      if (lead.teamLeadId) {
        const teamLead = await Employee.findOne({ where: { id: lead.teamLeadId } });
        if (teamLead) {
          teamLeadName = teamLead.name;
        }
      }

      // Return the lead with the added details
      return {
        ...lead.toJSON(), // Convert lead to plain object
        salesPersonName, // Add the sales person's name
        teamLeadName, // Add the team lead's name
      };
    }));

    res.status(200).json({ message: "Leads retrieved successfully", data: leadsWithDetails });
  } catch (error) {
    console.error("Error retrieving leads:", error);
    res.status(500).json({
      message: "Error retrieving leads",
      error: error.message || "An unexpected error occurred",
    });
  }
};


















export const AdminLeadsById = async (req, res) => {
  const { id } = req.params; // Extract the ID from request parameters

  try {
    const lead = await Lead.findByPk(id); // Find the lead by primary key (ID)

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead retrieved successfully", data: lead });
  } catch (error) {
    console.error("Error retrieving lead:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving lead",
        error: error.message || error,
      });
  }
};

export const AdmindeleteLead = async (req, res) => {
  const { id } = req.params; // Extract the ID from request parameters
  console.log(id);
  try {
    const deletedCount = await Lead.destroy({
      where: { id }, // Delete the lead with the specified ID
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res
      .status(500)
      .json({ message: "Error deleting lead", error: error.message || error });
  }
};

// controllers/LeadController.js
export const assignLeadsToEmployee = async (req, res) => {
  const { leadIds, employeeId } = req.body;

  try {
    const employee = await Employee.findOne({ where: { id: employeeId } });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    if (employee.usertype_name === "team_lead") {
      const [updatedCount] = await Lead.update(
        { teamLeadId: employeeId },
        { where: { id: leadIds } }
      );
      return res
        .status(200)
        .json({
          message: `${updatedCount} leads assigned to team leader ${employeeId}`,
        });
    } else {
      const [updatedCount] = await Lead.update(
        { assignToSales_personId: employeeId },
        { where: { id: leadIds } }
      );
      res
        .status(200)
        .json({
          message: `${updatedCount} leads assigned to employee ${employeeId}`,
        });
    }
  } catch (error) {
    console.error("Error assigning leads:", error);
    res
      .status(500)
      .json({ message: "Error assigning leads", error: error.message });
  }
};

// export const adminSelectedEmployeesLead = async (req, res) => {
//     const { employeeIds } = req.body;

//     try {
//       const leadCounts = {};

//       for (const id of employeeIds) {
//         const count = await Lead.count({ where: { assignToSales_personId: id } }); // Adjust based on your schema
//         leadCounts[id] = count;
//       }

//       res.json(leadCounts);
//     } catch (error) {
//       console.error('Error fetching lead counts:', error);
//       res.status(500).json({ message: 'Error fetching lead counts', error: error.message });
//     }
//   }





// export const adminSelectedEmployeesLead = async (req, res) => {
//   const { employees, status } = req.body; // Destructure status from request body

//   try {
//     const leadCounts = {};

//     // Loop through employees to get lead counts based on their usertype_name
//     for (const employee of employees) {
//       const { id, usertype_name } = employee;

//       var leadCount;
//       if (usertype_name === "team_lead") {
//         // If the employee is a team lead, get lead count based on teamLeadId
//         leadCount = await Lead.count({
//           where: {
//             teamLeadId: id,
//             ...(status && { status }), // Add status filter if provided
//           },
//         });
//       } else {
//         // Otherwise, get lead count based on assignToSales_personId
//         leadCount = await Lead.count({
//           where: {
//             assignToSales_personId: id,
//             ...(status && { status }), // Add status filter if provided
//           },
//         });
//       }

//       // Store the lead count in the response object
//       leadCounts[id] = leadCount;
//     }
//     console.log(leadCounts,leadCount);
//     res.status(200).json(leadCounts);
//   } catch (error) {
//     console.error("Error fetching lead counts:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching lead counts", error: error.message });
//   }
// };
export const adminSelectedEmployeesLead = async (req, res) => {
  const { employees, status, source, dateRange } = req.body;
  try {
    const leadData = {};
    for (const employee of employees) {
      const { id, usertype_name } = employee;

      // Prepare the "where" conditions with an OR clause for status, source, or dateRange
      const whereConditions = {
        [Op.or]: [
          ...(status ? [{ status }] : []),
          ...(source ? [{ source }] : []),
          ...(dateRange ? [{ createdAt: { [Op.between]: dateRange } }] : [])
        ],
      };

      let leadCount;
      let leadDetails;

      // Query based on the usertype_name
      if (usertype_name === "team_lead") {
        leadCount = await Lead.count({
          where: {
            teamLeadId: id,
            ...whereConditions,
          },
        });

        leadDetails = await Lead.findAll({
          where: {
            teamLeadId: id,
            ...whereConditions,
          },
        });
      } else {
        leadCount = await Lead.count({
          where: {
            assignToSales_personId: id,
            ...whereConditions,
          },
        });

        leadDetails = await Lead.findAll({
          where: {
            assignToSales_personId: id,
            ...whereConditions,
          },
        });
      }

      // Total leads without conditions
      const total = await Lead.findAll({
        where: {
          assignToSales_personId: id,
        },
      });

      // Store the results in leadData
      leadData[id] = {
        totalLeads: total.length,
        count: leadCount,
        details: leadDetails,
        totalLeadsDetails: total,
      };
    }

    console.log(leadData);
    res.status(200).json(leadData);
  } catch (error) {
    console.error("Error fetching lead counts:", error);
    res.status(500).json({ message: "Error fetching lead counts", error: error.message });
  }
};
  
  