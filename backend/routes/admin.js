const express = require('express');
const auth = require("../middleware/auth")
const adminController = require('../controller/admin/admin')
const ticketController = require('../controller/admin/ticket')

const { body } = require('express-validator');

const router = express.Router();

router.post('/login', [body('email').notEmpty().isEmail(), body('password').isLength({ min: 5 })], adminController.login);

router.use(auth.adminAuth)

router.get('/operation-managers', adminController.getOperationManagers);

router.get('/list-ticket', ticketController.listAllTicket);

router.post('/assign-ticket', [body('assignTo').notEmpty(), body('ticketId').notEmpty()],   ticketController.assignTicket);

router.get('/complete-ticket/:id',   ticketController.completeTicket);

router.get('/dashboard-charts', adminController.progressTicketsChart);

module.exports = router;
