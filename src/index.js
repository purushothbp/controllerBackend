const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeCollections } = require('./models/chromaClient');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/questions');
const audioRoute = require('./routes/audioFile');
const dataCheckRoutes = require('../src/controllers/setup/acl');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function startServer() {
  try {
    const collections = await initializeCollections();
    app.locals.collections = collections;

    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api', userRoutes);
    app.use('/api/questions', questionRoutes);
    app.use('/api', audioRoute);
    app.use('/api/data', dataCheckRoutes);  

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
  }
}

startServer();
