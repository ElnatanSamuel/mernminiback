const Ticket = require('../models/Ticket');

const ticketController = {
  async createTicket(req, res) {
    try {
      const ticket = new Ticket({
        ...req.body,
        createdBy: req.user.id
      });
      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getTickets(req, res) {
    try {
      const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
      const tickets = await Ticket.find(query).populate('createdBy', 'username');
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateTicketStatus(req, res) {
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = ticketController; 