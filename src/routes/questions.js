const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/chat/chat');

// router.get('/', questionsController.getAllQuestions);
router.post('/', questionsController.askQuestion);

module.exports = router;
