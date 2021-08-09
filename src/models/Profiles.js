import { Model } from 'sequelize';

export default class Profiles extends Model {
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
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      invited_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      followed_by: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
      follows: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'profiles',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'profiles_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'profiles_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
    return Profiles;
  }
}
