const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'jwt_5v8x/A?D(G+KbPeShVmYq3t6w9z$C&F)'; // Hardcode for testing

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
      
      // Add error handling for missing credentials
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token,
        role: user.role,
        username: user.username
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController; 