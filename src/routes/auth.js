// routes/auth.js
const express = require('express');
const { createUser, findUserByEmail } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, role } = req.body;
  
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await createUser(firstname, lastname, email, role);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

module.exports = router;
