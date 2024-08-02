const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const multer = require('multer');
const stream = require('stream');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const REGION = process.env.REGION;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

if (!REGION || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error('AWS credentials or region not set');
  process.exit(1);
}

AWS.config.update({
  region: REGION,
  credentials: new AWS.Credentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY)
});

const lexruntime = new AWS.LexRuntime();

// Configure multer for handling file uploads and storing in /uploadedfile
const uploadPath = path.join(__dirname, 'uploadedfile');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

ffmpeg.setFfmpegPath('C:\\Users\\mural\\Downloads\\ffmpeg-master-latest-win64-gpl\\ffmpeg-master-latest-win64-gpl\\bin\\ffmpeg.exe');

const uploadAudio = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const inputFilePath = path.join(uploadPath, req.file.filename);
  const outputFilePath = path.join(uploadPath, `converted-${Date.now()}.wav`);

  console.log(`Input file path: ${inputFilePath}`);
  console.log(`Output file path: ${outputFilePath}`);

  // Ensure the file exists
  if (!fs.existsSync(inputFilePath)) {
    return res.status(404).send('File not found.');
  }

  ffmpeg(inputFilePath)
    .inputFormat('mp3') // Ensure this matches the actual file format
    .audioCodec('pcm_s16le')
    .audioFrequency(16000)
    .audioChannels(1)
    .format('wav') // Output format
    .on('start', (commandLine) => {
      console.log('Spawned FFmpeg with command: ' + commandLine);
    })
    .on('stderr', (stderrLine) => {
      console.log('FFmpeg stderr: ' + stderrLine);
    })
    .on('error', (err) => {
      console.error('Error during audio processing:', err);
      return res.status(500).json({ error: 'Error processing audio.', details: err });
    })
    .on('end', () => {
      console.log('FFmpeg conversion finished.');

      const convertedAudioStream = fs.createReadStream(outputFilePath);
      const lexParams = {
        botAlias: 'courseBot',
        botName: 'courseBot',
        inputStream: convertedAudioStream,
        userId: 'ZSJNFE5XGT',
        contentType: 'audio/l16; rate=16000',
        accept: 'text/plain; charset=utf-8'
      };

      lexruntime.postContent(lexParams, (err, data) => {
        if (err) {
          console.error('Error with Lex Runtime:', err);
          return res.status(500).json({ error: 'Error processing audio with Lex.', details: err });
        } else {
          console.log('Lex response:', data);
          return res.json({ message: data.message });
        }
      });
    })
    .save(outputFilePath);
};

module.exports = {
  upload,
  uploadAudio
};
