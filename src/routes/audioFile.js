const express = require('express');
const multer = require('multer');
const audioController = require('../../src/controllers/chat/audio');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload-audio', upload.single('file'), audioController.uploadAudio);

module.exports = router;
