import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meetingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('completed', 'upcoming', 'pending'),
    defaultValue: 'upcoming',
  },
}, {
  timestamps: true,
});

Meeting.sync({ alter: true })
  .then(() => console.log('Meeting table created/updated'))
  .catch(err => console.log('Error in creating Meeting table: ' + err));

export default Meeting;
