const express = require('express');
const router = express.Router();
const getUser = require('../controllers/user/fetchUsers')

router.get('/users/:userId',getUser );

module.exports = router;
