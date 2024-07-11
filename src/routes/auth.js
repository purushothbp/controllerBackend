const express = require('express');
const { signup, login, googleLogin } = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);

module.exports = router;
