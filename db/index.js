require("dotenv").config();
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize({
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $in: Op.contains,
  },

  pool: {
    min: 0,
    max: 5,
    acquire: 3000,
    idle: 1000,
  },
});

const db = {};

db.sequelize = sequelize;

db.sequelize
  .authenticate()
  .then(() => {
    console.log("DB is authenticated");
  })
  .catch((error) => {
    console.log(error);
  });

db.movies = require("./models/movieModel")(sequelize, DataTypes);
db.users = require("./models/userModel")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB sync is completed");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = db;
