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
}

module.exports = new UserService();