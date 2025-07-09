module.exports = (sequelize, DataTypes) => {
  return sequelize.define("movie", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
    },

    format: {
      type: DataTypes.STRING,
    },

    actors: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
};
