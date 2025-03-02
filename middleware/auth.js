const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jwt_5v8x/A?D(G+KbPeShVmYq3t6w9z$C&F)';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const tokenString = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenString, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { auth, isAdmin }; 