import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Product = sequelize.define('Product', {
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
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalsale: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {  
  timestamps: true,
});

Product.sync({ alter: true })
  .then(() => console.log('product table created/updated'))
  .catch(err => console.log('Error in product table: ' + err));

export default Product;
