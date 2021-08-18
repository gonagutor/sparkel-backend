import { Model, Sequelize } from 'sequelize';

export default class Stories extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      data_uri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      viewed_by: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
      posted_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('now'),
      },
    }, {
      sequelize,
      tableName: 'stories',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'stories_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'stories_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
    return Stories;
  }
}
