const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const scraping_tasks = sequelize.define(
    'scraping_tasks',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

scheduled_time: {
        type: DataTypes.DATE,

      },

status: {
        type: DataTypes.ENUM,

        values: [

"pending",

"in_progress",

"completed",

"failed"

        ],

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  scraping_tasks.associate = (db) => {

    db.scraping_tasks.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.scraping_tasks.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return scraping_tasks;
};

