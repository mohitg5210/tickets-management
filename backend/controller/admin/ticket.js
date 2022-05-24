const ticketService = require('../../services/ticket');
const jwt = require('jsonwebtoken')
const config = require("../../config/config")
const { validationResult } = require('express-validator')

class TicketController {
  
  async assignTicket(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.header("accessToken");
      const decoded = jwt.verify(token, config.secret) 
      if(decoded.userType !== 'Admin'){
        return res.status(403).json({"message":"Permission denied!"})
      }
      const data = req.body;
      const user = await ticketService.assignTicket(data);
      if(user == 1){
        return res.json({"message":"Updated successfully!"})
      }else{
        return res.json({"message":"Something went wrong!"});
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async completeTicket(req, res, next) {
    try {
      const token = req.header("accessToken");
      const decoded = jwt.verify(token, config.secret) 
      if(decoded.userType !== 'Operation Manager'){
        return res.status(403).json({"message":"Permission denied!"})
      }
      
      const ticketId = Number(req.params.id);
      const assignTo = decoded.id;
      const getTicketInfo = await ticketService.getByTicketId(ticketId);
      if(!getTicketInfo){
        return res.json({"message":"Invalid Ticket!"})
      }
      const date1 = new Date(getTicketInfo.updatedAt);
      const date2 = new Date();
      const TimeTaken = ticketService.getDifferenceInHours(date1,date2);
      
      const user = await ticketService.completeTicket(ticketId,assignTo,TimeTaken);
      if(user == 1){
        return res.json({"message":"Updated successfully!"})
      }else if(user == 0){
        return res.json({"message":"Invalid Ticket!"})
      }else{
        return res.json(user);
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  
  async listAllTicket(req, res, next) {
    try {
      const token = req.header("accessToken");
      const decoded = jwt.verify(token, config.secret) 
      if(decoded.userType == 'Admin'){
        const user = await ticketService.listAllTicket();
        res.json(user);
      }else{
        const assignTo = decoded.id;
        const user = await ticketService.getListAssignTickets(assignTo);
        res.json(user);
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  
}

module.exports = new TicketController();
