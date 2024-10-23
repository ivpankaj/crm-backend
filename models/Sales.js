import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Sales = sequelize.define('Sales', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salesAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  salesDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quantitySold: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
  },
  sales_personId: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

Sales.sync({ alter: true })
  .then(() => console.log('sales table created/updated'))
  .catch(err => console.log('Error in sales table: ' + err));

export default Sales;
