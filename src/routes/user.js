const express = require('express');
const { updateUser } = require('../controllers/user/user');
const router = express.Router();

router.put('/users/:userId', updateUser);

module.exports = router;
