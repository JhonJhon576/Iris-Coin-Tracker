const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const alerts = sequelize.define(
    'alerts',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

message: {
        type: DataTypes.TEXT,

      },

triggered_at: {
        type: DataTypes.DATE,

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

  alerts.associate = (db) => {

    db.alerts.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.alerts.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return alerts;
};

