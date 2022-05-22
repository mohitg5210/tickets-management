const { Model } = require('objection');

class Ticket extends Model {
  static get tableName() {
    return 'ticket';
  }

  static get relationMappings() {
    const User = require('./user');
    return {
      client: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'ticket.userId',
          to: 'user.id',
        },
      },
      operationsManager : {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'ticket.assignTo',
          to: 'user.id',
        },
      },
    };
  }
}

module.exports = Ticket;
