import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Work_employee = sequelize.define('Work_employee',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employeeId:{
        type: DataTypes.INTEGER,
    
    },
    description:{
        type: DataTypes.TEXT,
    },
    workpic:{
        type: DataTypes.STRING,
    },
    date:{
        type: DataTypes.DATEONLY,
    }
}
)

Work_employee.sync({alter:true})
.then(()=>console.log("work employee table has been created successfully"))
.catch(()=>console.log("work employee`s table has been created successfully"))


export default Work_employee;