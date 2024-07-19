const express = require('express');
const { signup, login, googleLogin } = require('../controllers/auth');

const authRoutes = express.Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/google-login', googleLogin);

module.exports = authRoutes;
