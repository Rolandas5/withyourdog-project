const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Issitraukiam tokena is headerio
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // 2. Pasiziurim ar tokenas egzistuoja
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // 3. Verifikuojam tokena
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Bandom gauti useri is duomenu bazes
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // 5. Pridedam useri prie request objecto
    req.user = user;
    next();
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = authMiddleware;
