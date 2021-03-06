const User = require('../db/models/user');
const Ticket = require('../db/models/ticket');
const Role = require('../db/models/role');

class UserService {

  findByEmail(email) {
    return User.query().findOne('email', email).withGraphFetched('role')
    .modifyGraph('role', builder => {
      return builder.select('name');
    });
  }

  getOperationManagers() {   
    const id = 2;
    return User.query().where('role_id', id).select('id','name').withGraphFetched('assignedTickets')
    .modifyGraph('assignedTickets', builder => {
      return builder.where("status","In Progress")
      .select('id','title')
      .orderBy("createdAt","DESC");
    });
  }

  async getprogressTicketsChart() {
    const id = 2;
    const query = {};
    query.ticketsStatusData = await Ticket.query().select("status").count().as("value").groupBy("status");   
    
    query.assignedTickets = await User.query().where('roleId', id).select(
      'id','name',
      User.relatedQuery('assignedTickets')
      .where("status","In Progress")
        .count()
        .as('inProgress'),
        
      User.relatedQuery('assignedTickets')
      .where("status","Closed")
        .count()
        .as('closed'),
    );
    
    query.TicketsTakenTime = await User.query().where('roleId', id)
    .select('id','name')
    .withGraphFetched("assignedTickets")
    .modifyGraph('assignedTickets', builder => {
      const queryBuilder = builder.whereNot("TimeTaken",null)
      .select('id','status','timeTaken')
      return queryBuilder
    });
    return query
  }
}

module.exports = new UserService();