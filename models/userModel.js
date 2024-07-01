import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define("siswa", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  nama_kelas: {
    type: DataTypes.STRING,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
  }
}, {
  freezeTableName: true
});

export default Users



