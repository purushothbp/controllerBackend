const jwt = require('jsonwebtoken');
const acl = require('../controllers/setup/acl');

const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const checkRole = (role) => (req, res, next) => {
  acl.hasRole(req.user, role, (err, hasRole) => {
    if (err) return res.status(500).send(err);
    if (!hasRole) return res.status(403).send('Permission denied');
    next();
  });
};

module.exports = { auth, checkRole };
