import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define("siswa", {
  username:{
    type: DataTypes.STRING,
  },
  password:{
    type: DataTypes.STRING,
  },
  nama_kelas:{
    type:DataTypes.STRING
  },
  refresh_token:{
    type: DataTypes.TEXT,
  }
},{
    FreezeTableName:true
});

export default Users
