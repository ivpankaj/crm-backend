import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  teamLeadId:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDeleted:{
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usertype_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teamLeaderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hireDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  attendanceCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING, 
    allowNull: true,        
  },
}, {
  timestamps: true,
});
Employee.sync({ alter: true })
  .then(() => console.log('Employee table updated'))
  .catch(err => console.log('Error in employee table ' + err));

export default Employee;
