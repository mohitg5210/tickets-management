const Ticket = require('../db/models/ticket');

class TicketService {
  
  listTicket(clientId) {
    return Ticket.query().where("userId",clientId).orderBy("createdAt","DESC").withGraphFetched('operationsManager')
    .modifyGraph('operationsManager', builder => {
      return builder.select('name');
    });
  }

  createTicket(data) {
    return Ticket.query().insert({
      title:data.title,
      description: data.description,
      status: 'Open',
      userId: data.userId
    });
  }

  assignTicket(data){
    return Ticket.query().update({
      status: 'In Progress',
      assignTo: data.assignTo
    }).where('id', data.ticketId);
  }

  completeTicket(ticketId,assignTo){
    return Ticket.query().update({
      status: 'Closed'
    }).where('id', ticketId).andWhere("assignTo",assignTo).andWhere("status",'In Progress');
  }
  
  listAllTicket() {
    return Ticket.query().select('id','title','description','status','createdAt','updatedAt').orderBy("createdAt","DESC")
    .withGraphFetched('operationsManager')
    .withGraphFetched('client')
    .modifyGraph('operationsManager', builder => {
      return builder.select('id','name');
    })
    .modifyGraph('client', builder => {
      return builder.select('id','name');
    });
  }

  getListAssignTickets(assignTo) {
    return Ticket.query().select('id','title','description','status','createdAt','updatedAt').orderBy("createdAt","DESC").where("assignTo",assignTo).withGraphFetched('client')
    .modifyGraph('client', builder => {
      return builder.select('id','name');
    });
  }


}

module.exports = new TicketService();

