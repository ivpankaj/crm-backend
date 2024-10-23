import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    allowNull: false,
    defaultValue: 'Medium',
  },
  dueDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sales_personId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});


Task.sync({ alter: true })
  .then(() => console.log('Task_salesperson table updated'))
  .catch(err => console.log('Error in Task_salesperson table sync: ' + err));

export default Task;
