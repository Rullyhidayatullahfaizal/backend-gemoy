import { Sequelize } from "sequelize";

const db = new Sequelize("gemoy","root","",{
    host:"localhost",
    dialect:"mysql",
});

export default db;