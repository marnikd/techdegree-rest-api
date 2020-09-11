'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for the first name',
        },
        notEmpty: {
          msg: 'Please provide a value for the first name',
        }
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for the last name',
        },
        notEmpty: {
          msg: 'Please provide a value for the last name',
        }
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: {
          msg: 'Please provide a value for email',
        },
        notEmpty: {
          msg: 'Please provide a value for email',
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for password',
        },
        notEmpty: {
          msg: 'Please provide a value for password',
        }
      }
    }
  }, 
  {
    sequelize 
  });

  User.associate = (models) => {
    User.hasMany(models.Course, { 
      as: 'userIdentity',
      foreignKey: {
      fieldName: 'userId',
      allowNull: false,
      },
    });
  };
  
  return User;
};
