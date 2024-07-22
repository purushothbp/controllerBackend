const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const User = require('../models/users');

const router = express.Router();

router.get('/users', auth, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
