import { Model, Sequelize } from 'sequelize';

export default class Posts extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      data_uri: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      caption: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      posted_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('now'),
      },
      sparkled_by: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
      posted_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'posts',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'posts_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'posts_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
    return Posts;
  }
}
