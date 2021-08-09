import { Model, Sequelize } from 'sequelize';

export default class VerificationCodes extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      generated_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('now'),
      },
    }, {
      sequelize,
      tableName: 'verification_codes',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'verification_codes_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'verification_codes_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
    return VerificationCodes;
  }
}
