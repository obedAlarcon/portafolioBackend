'use strict';

const { PROYECT_TABLE, ProyectSchema } = require('../models/proyect.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(PROYECT_TABLE,ProyectSchema)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.drop(PROYECT_TABLE)
  }
};
