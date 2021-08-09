import { DataTypes } from 'sequelize';
import _comments from './Comments';
import _inviteCodes from './InviteCodes';
import _posts from './Posts';
import _profiles from './Profiles';
import _stories from './Stories';
import _users from './Users';
import sequelize from '../database';

export default class Models {
  Comments

  InviteCodes

  Posts

  Profiles

  Stories

  Users

  constructor() {
    this.Comments = _comments.init(sequelize, DataTypes);
    this.InviteCodes = _inviteCodes.init(sequelize, DataTypes);
    this.Posts = _posts.init(sequelize, DataTypes);
    this.Profiles = _profiles.init(sequelize, DataTypes);
    this.Stories = _stories.init(sequelize, DataTypes);
    this.Users = _users.init(sequelize, DataTypes);

    this.Comments.belongsTo(this.Posts, { as: 'post', foreignKey: 'post_id' });
    this.Posts.hasMany(this.Comments, { as: 'comments', foreignKey: 'post_id' });
    this.InviteCodes.belongsTo(this.Users, { as: 'generated_by_user', foreignKey: 'generated_by' });
    this.Users.hasMany(this.InviteCodes, { as: 'invite_codes', foreignKey: 'generated_by' });
    this.Profiles.belongsTo(this.Users, { as: 'id_user', foreignKey: 'id' });
    this.Users.hasOne(this.Profiles, { as: 'profile', foreignKey: 'id' });
    this.Profiles.belongsTo(this.Users, { as: 'invited_by_user', foreignKey: 'invited_by' });
    this.Users.hasMany(this.Profiles, { as: 'invited_by_profiles', foreignKey: 'invited_by' });
  }
}
