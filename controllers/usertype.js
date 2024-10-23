import UserType from "../models/usertype.js";

export const createUserType = async (req, res) => {
  try {
    const { usertype_name } = req.body;

    if (!usertype_name) {
      return res.status(400).json({ error: "User type name is required" });
    }

    // Check if user type already exists
    const existingUserType = await UserType.findOne({ where: { usertype_name } });
    if (existingUserType) {
      return res.status(400).json({ message: "User type already exists" });
    }

    // Create new user type
    const newUserType = await UserType.create({ usertype_name });
    return res.status(201).json({ message: "User type created successfully", data: newUserType });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user type", details: error.message });
  }
};



export const updateUserType = async (req, res) => {
  try {
    const { id } = req.params;
    const { usertype_name } = req.body;

    const userType = await UserType.findByPk(id);
    if (!userType) {
      return res.status(404).json({ error: "User type not found" });
    }

    userType.usertype_name = usertype_name || userType.usertype_name;
    await userType.save();

    return res.status(200).json({ message: "User type updated successfully", data: userType });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user type", details: error.message });
  }
};

// Delete a UserType
export const deleteUserType = async (req, res) => {
  try {
    const { id } = req.params;

    const userType = await UserType.findByPk(id);
    if (!userType) {
      return res.status(404).json({ error: "User type not found" });
    }

    await userType.destroy();
    return res.status(200).json({ message: "User type deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user type", details: error.message });
  }
};

// Get all UserTypes (optional for fetching data)
export const getAllUserTypes = async (req, res) => {
  try {
    const userTypes = await UserType.findAll();
    return res.status(200).json({ data: userTypes });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user types", details: error.message });
  }
};
