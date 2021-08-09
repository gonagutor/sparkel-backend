import { Model, Sequelize } from 'sequelize';

export default class InviteCodes extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Sequelize.fn('random_string', 6),
      },
      generated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      generated_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('now'),
      },
      valid_until: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('NOW() + \'1 day\''),
      },
    }, {
      sequelize,
      tableName: 'invite_codes',
      schema: 'public',
      hasTrigger: true,
      timestamps: false,
      indexes: [
        {
          name: 'invite_codes_code_uindex',
          unique: true,
          fields: [
            { name: 'code' },
          ],
        },
        {
          name: 'invite_codes_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'invite_codes_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
    return InviteCodes;
  }
}
