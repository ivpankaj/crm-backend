import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Notes = sequelize.define('Notes', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    leadId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    note :{
        type: DataTypes.TEXT,
        allowNull: false,
    }
},{
    timestamps: true,
}
)
Notes.sync({alter:true})
    .then(() => console.log("Notes table created"))
    .catch(() => console.log("Notes table error"));

export default Notes;