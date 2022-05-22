const { Model } = require('objection');

class Role extends Model {
  static get tableName() {
    return 'role';
  }

  static get relationMappings() {
    const User = require('./user');
    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'role.id',
          to: 'user.roleId',
        },
      },
    };
  }
}

module.exports = Role;
