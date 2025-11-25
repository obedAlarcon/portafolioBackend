const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class ProyectService {

  async create(data) {
    const newProyect = await models.Proyect.create(data);
    return newProyect;
  }

  async find() {
    const projects = await models.Proyect.findAll();

    const BASE_URL = 'https://portafoliobackend-ehts.onrender.com';

    return projects.map(p => ({
      ...p.dataValues,
      image: p.image ? `${BASE_URL}/uploads/${p.image}` : null
    }));
  }

  async findOne(id) {
    const proyect = await models.Proyect.findByPk(id);
    if (!proyect) {
      throw boom.notFound('Proyect not found');
    }

    const BASE_URL = 'https://portafoliobackend-ehts.onrender.com';

    return {
      ...proyect.dataValues,
      image: proyect.image ? `${BASE_URL}/uploads/${proyect.image}` : null
    };
  }

  async update(id, changes) {
    const proyect = await this.findOne(id);
    const response = await proyect.update(changes);
    return response;
  }

  async delete(id) {
    const proyect = await this.findOne(id);
    await proyect.destroy();
    return { id };
  }
}

module.exports = ProyectService;
