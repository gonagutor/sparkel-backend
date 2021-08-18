import { Model, Sequelize } from 'sequelize';

export default class Comments extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      posted_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn('now'),
      },
      sparked_by: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
      posted_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'comments',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'comments_id_uindex',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
        {
          name: 'comments_pk',
          unique: true,
          fields: [
            { name: 'id' },
          ],
        },
      ],
    });
    return Comments;
  }
}
