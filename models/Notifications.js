import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  notificationType: {
    type: DataTypes.ENUM('info', 'warning', 'success', 'error'),
    defaultValue: 'info',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'notifications',
});

Notification.sync({alter: true})
.then(()=>console.log('notification table created'))
.catch(()=>console.log('notification table'));

export default Notification;
