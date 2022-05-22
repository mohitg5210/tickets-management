const ticketService = require('../services/ticket');
const jwt = require('jsonwebtoken')
const config = require("../config/config");
const { validationResult } = require('express-validator');

class TicketController {
  
  async createTicket(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const token = req.header("accessToken");
      const decoded = jwt.verify(token, config.secret) 
      const newTicket = req.body
      newTicket.userId = decoded.id
      const ticket = await ticketService.createTicket(newTicket);
      res.status(201).json(ticket);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  
  async listTicket(req, res, next) {
    try {
      const token = req.header("accessToken");
      const decoded = jwt.verify(token, config.secret) 
      const clientId = decoded.id
      const data = await ticketService.listTicket(clientId);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  
}

module.exports = new TicketController();
