import { Model } from 'sequelize';

export default class Users extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'users',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'table_name_email_uindex',
          unique: true,
          fields: [
            { name: 'email' },
          ],
        },
        {
          name: 'table_name_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'table_name_username_uindex',
          unique: true,
          fields: [
            { name: 'username' },
          ],
        },
      ],
    });
    return Users;
  }
}
