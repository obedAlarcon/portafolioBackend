const { Sequelize, Model } = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');

const PROYECT_TABLE = 'proyects';
const ProyectSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    backend: {
        allowNull: false,
        type: DataTypes.STRING
    },
    frontend: {
        allowNull: false,
        type: DataTypes.STRING
    },
    librarys: {
        allowNull: false,
        type: DataTypes.STRING
    },
    image: {
        allowNull: false,
        type: DataTypes.STRING
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }
};
class Proyect extends Model {
    static associate(models) {
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: PROYECT_TABLE,
            modelName: 'Proyect',
            timeStamps: false
        };

    }


}
module.exports = {
    PROYECT_TABLE,
    Proyect,
    ProyectSchema
};
