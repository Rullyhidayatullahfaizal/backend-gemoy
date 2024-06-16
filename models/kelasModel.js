import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Guru from "./guruModel.js";

const { DataTypes } = Sequelize;

const Kelas = db.define("kelas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_kelas: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nama_walikelas: {
    type: DataTypes.INTEGER,
    references: {
      model: Guru,
      key: 'id'
    }
  }
}, {
  freezeTableName: true
});

// Define the one-to-one relationship
Guru.hasOne(Kelas, { foreignKey: 'nama_walikelas' });
Kelas.belongsTo(Guru, { foreignKey: 'nama_walikelas' });

export default Kelas;
