const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

router.get('/users/:userId', async (req, res) => {
  try {
    const { userCollection } = req.app.locals.collections;
    const queryData = await userCollection.query({
      queryTexts: [req.params.userId],
    });
    if (queryData.documents.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(queryData.documents[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/users', auth, checkRole('admin'), async (req, res) => {
  try {
    const { userCollection } = req.app.locals.collections;
    const queryData = await userCollection.query({
      queryTexts: [],
    });
    res.status(200).json(queryData.documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
