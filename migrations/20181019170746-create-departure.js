'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Departures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      LastName: {
        type: Sequelize.STRING
      },
      FirstName: {
        type: Sequelize.STRING
      },
      Affiliation: {
        type: Sequelize.STRING
      },
      Position: {
        type: Sequelize.STRING
      },
      DateHired: {
        type: Sequelize.DATE
      },
      DateLeft: {
        type: Sequelize.DATE
      },
      TotalTime: {
        type: Sequelize.INTEGER
      },
      TrumpTime: {
        type: Sequelize.INTEGER
      },
      MoochesTime: {
        type: Sequelize.FLOAT
      },
      LeaveType: {
        type: Sequelize.STRING
      },
      Notes: {
        type: Sequelize.TEXT
      },
      Image: {
        type: Sequelize.STRING
      },
      Sources: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Departures');
  }
};
