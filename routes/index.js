const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const { auth, isAdmin } = require('../middleware/auth');

// Public auth routes
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);

// Protected routes - apply auth middleware
router.use(auth);

// Ticket routes
router.post('/tickets', ticketController.createTicket);
router.get('/tickets', ticketController.getTickets);
router.put('/tickets/:id', isAdmin, ticketController.updateTicketStatus);

module.exports = router; 