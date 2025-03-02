const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'your-secret-key'; // Hardcode for testing

const authController = {
  async signup(req, res) {
    try {
      const { username, password, role } = req.body;
      console.log('Signup attempt:', { username, role });
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const user = new User({
        username,
        password, // Let the model's pre-save hook handle hashing
        role: role || 'user'
      });
      
      await user.save();
      console.log('User saved:', user);
      
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({ 
        token, 
        role: user.role,
        username: user.username 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username }); // Don't log passwords
      
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found:', username);
        return res.status(401).json({ message: 'Invalid credentials - user not found' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('Password mismatch for user:', username);
        return res.status(401).json({ message: 'Invalid credentials - password mismatch' });
      }
      
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('Login successful for:', username);
      res.json({ 
        token,
        role: user.role,
        username: user.username
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController; 