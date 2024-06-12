import { Sequelize } from "sequelize";
import db from "../config/database.js";


const { DataTypes } = Sequelize;

const Admins = db.define("admin", {
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true
});

export default Admins