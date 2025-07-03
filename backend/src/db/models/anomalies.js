const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const anomalies = sequelize.define(
    'anomalies',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

description: {
        type: DataTypes.TEXT,

      },

detected_at: {
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

  anomalies.associate = (db) => {

    db.anomalies.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.anomalies.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return anomalies;
};

