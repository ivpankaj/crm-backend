import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserType = sequelize.define(
  "UserType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usertype_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

UserType.sync({ alter: true })
  .then(() => console.log("user type name table created"))
  .catch(() => console.log("user type name table error"));
export default UserType;
