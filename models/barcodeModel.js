import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";
import makanans from "./makananModel.js";

const { DataTypes } = Sequelize;

const ScanHistory = db.define("ScanHistory", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Users, 
      key: 'id'
    }
  },
  makananId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: makanans, 
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  freezeTableName: true
});

ScanHistory.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
ScanHistory.belongsTo(makanans, { foreignKey: 'makananId', as: 'makanan' });

export default ScanHistory;
