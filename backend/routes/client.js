const express = require('express');
const auth = require("../middleware/auth")
const userController = require('../controller/user');
const ticketController = require('../controller/ticket');
const { body } = require('express-validator');

const router = express.Router();

router.post('/login', [body('email').notEmpty().isEmail(), body('password').isLength({ min: 5 })], userController.login);

router.use(auth.userAuth)

router.post('/create-ticket', [body('title').notEmpty(), body('description').notEmpty()], ticketController.createTicket);

router.get('/list-ticket', ticketController.listTicket);

module.exports = router;
