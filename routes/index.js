const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const { auth, isAdmin } = require('../middleware/auth');

// Public auth routes (no auth middleware)
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);

// Protected routes
router.use(auth);
router.get('/tickets', ticketController.getTickets);
router.post('/tickets', ticketController.createTicket);
router.put('/tickets/:id', isAdmin, ticketController.updateTicketStatus);

module.exports = router; 