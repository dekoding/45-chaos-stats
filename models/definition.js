'use strict';
module.exports = (sequelize, DataTypes) => {
  const Definition = sequelize.define('Definition', {
    Name: DataTypes.STRING,
    Definition: DataTypes.TEXT
  }, {});
  Definition.associate = function(models) {
    // associations can be defined here
  };
  return Definition;
};
