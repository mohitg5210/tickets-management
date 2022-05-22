const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    const Role = require('./role');
    const Ticket = require('./ticket');
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'user.roleId',
          to: 'role.id',
        },
      },
      assignedTickets: {
        relation: Model.HasManyRelation,
        modelClass: Ticket,
        join: {
          from: 'user.id',
          to: 'ticket.assignTo',
        },
      },
    };
  }
}

module.exports = User;
