'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for the title',
        },
        notEmpty: {
          msg: 'Please provide a value for the title',
        }
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for the description',
        },
        notEmpty: {
          msg: 'Please provide a value for the description',
        }
      }
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true
    },
    materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
      }
  }, 
  {
    sequelize 
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, { 
      as: 'userIdentity',
      foreignKey: {
      fieldName: 'userId',
      allowNull: false,
      },
    });
  };

  return Course;
};